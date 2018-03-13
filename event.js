/*global Selector */
(function (exports) {
    "use strict";

    /*
     for EventListenerOptions in Chrome 51, Firefox 49 and landed in WebKit.
     https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     */

    function isPassive() {
        var supportsPassiveOption = false;
        try {
            addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassiveOption = true;
                }
            }));
        } catch(e) {}
        return supportsPassiveOption;
    }

    exports.DOMEvent = {

        on: function () {
            if (document.addEventListener) {
                return function (el, type, fn, opt) {
                    if (!el) {
                        throw new Error('failed to add event. Element: "' + el + '", Event: "' + type + '", handler: ' + fn.toString());
                    }

                    if(isPassive() && opt) {
                        if (!opt.hasOwnProperty('capture')) {
                            opt.capture = false; //by default
                        }
                    } else {
                        opt = false;
                    }

                    el.addEventListener(type, fn, opt);
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
                return function (el, type, fn, opt) {
                    if(isPassive() && opt) {
                        if (!opt.hasOwnProperty('capture')) {
                            opt.capture = false; //by default
                        }
                    } else {
                        opt = false;
                    }
                    el.removeEventListener(type, fn, opt);
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