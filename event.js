/*global Selector */
(function (exports) {
    "use strict";

    exports.DOMEvent = {

        on: function () {
            if (document.addEventListener) {
                return function (el, type, fn) {
                    if (!el) {
                        throw new Error('failed to add event. Element: "' + el + '", Event: "' + type + '", handler: ' + fn.toString());
                    }
                    el.addEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    if (!el) {
                        throw new Error('failed to add event. Element: "' + el + '", Event: "' + type + '", handler: ' + fn.toString());
                    }
                    el.attachEvent('on' + type, fn);
                };
            }
        }(),

        off: function () {
            if (document.removeEventListener) {
                return function (el, type, fn) {
                    el.removeEventListener(type, fn, false);
                };
            } else {
                return function (el, type, fn) {
                    el.detachEvent("on" + type, fn);
                };
            }
        }(),

        preventDefault: function (e) {
            var ev = e || window.event;
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.returnValue = false;
            }
        },

        stopPropagation: function (e) {
            var ev = e || window.event;
            if (ev.stopPropagation) {
                ev.stopPropagation();
            } else {
                ev.cancelBubble = true;
            }
        },

        getTarget: function (e) {
            var ev = e || window.event;
            return ev.target || ev.srcElement;
        }
    };

    function delegate(el, selector, type, fn) {
        if (typeof Selector === 'undefined') {
            throw new Error('dependency not found. you should include selector-alias module to use delegate function.');
        }
        if (!el) {
            throw new Error('failed to delegate event. Element: "' + el + '", Selector: "' + selector + '", Event: "' + type + '", handler: ' + fn.toString());
        }

        var $$ = Selector.$$;

        exports.DOMEvent.on(el, type, function (e) {
            var currentTarget = exports.DOMEvent.getTarget(e),
                targets = $$(selector, el);

            targets = Array.prototype.slice.apply(targets);

            while (currentTarget && currentTarget !== el) {
                if (currentTarget.nodeType === 1 && targets.indexOf(currentTarget) > -1) {
                    fn(e, currentTarget);
                    break;
                }
                currentTarget = currentTarget.parentNode;
            }
        });
    }

    exports.DOMEvent.delegate = delegate;

})(window);