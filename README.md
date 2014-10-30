simple-event
==================

[![Build Status](https://travis-ci.org/html5crew/simple-event.svg?branch=master)](https://travis-ci.org/html5crew/simple-event)

Simple Javascript DOM Event Library


## usage

```
$ bower install simple-event


<!-- include your bower dependencies -->

<script>
    ...
    
    DOMEvent.on(btnEl, 'click', function clickHandler() {
        alert('hi');
        DOMEvent.off(btnEl, 'click', clickHandler);
    });
    
    ...
    
    DOMEvent.delegate(containerEl, 'li .btn', 'click', function () {
        alert('list button');
    });
    
</script>
```