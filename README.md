# tal.js

Check the downloads button on [the github](http://github.com/talby/tal.js#download_button) for a compiled version of tal.js
or compile it yourself by running `thor taljs:compile`

## Events

Generate by

    new Tal.Event([{options}],[funciton,...])

### Basic event firing

    obj = {};
    obj.onClick = new Tal.event();
    obj.onClick.bind(function(a) {console.log("omg I was clicked "+a)});
    obj.onClick.fire("by a madman");
    // => omg I was clicked by a madman
    obj.onClick.bind(function(a) {console.log("omg I was touched "+a)});
    obj.onClick.fire("nice guy");
    // => omg I was clicked by a nice guy
    // => omg I was touched by a nice guy

### Onetime firing

If you want the event to be a wait, ie the event is probably only fired once and any other
additions will be fired immediately upon binding

    obj = {};
    obj.onClick = new Tal.event({once: true});
    obj.onClick.bind(function(a) {console.log("omg I was clicked "+a)});
    obj.onClick.fire("by a madman");
    // => omg I was clicked by a madman
    obj.onClick.bind(function(a) {console.log("omg I was touched "+a)});
    // => omg I was touched by a madman
    obj.onClick.fire("by a nice guy");
    // => omg I was clicked by a nice guy
    // => omg I was touched by a nice guy
    obj.onClick.bind(function(a) {console.log("omg I was seen "+a)});
    // => omg I was seen by a nice guy

## Popups

To get a basic popup going you can do this (name is an optional but recommended
field):

    popup = new Tal.Popup({
      width: 220,
      name: "mytest_popup",
      html: "This goes in the body of my popup"
    });
    
    popup.show();

In the src directory there are an image file for the close button and a css file for basic styling.

The popups will freeze the window in place and only allow scrolling within the popup if it's larger than the window (
think the new Facebook theater view for photos).

You can specify many features in the creation here are the defaults:

    width: 774            # width of the popup
    overlayOpacity: 0.7   # darkness of the background overlay
    overlaySpeed: 500     # speed to show the overlay
    closeSpeed: 200       # how fast to show/hide the popup
    closeAnimation: 'shrink' # animation to use to show/hide the popup
                             #   other options being: 
                             #     slide: slides in from the right and out the left
                             #     drop: drops down then retreats back up
                             #     instant: nothing special, just show/hide
    lock: true            # enable or disable the theater mode

The object has a few getters which are useful:

    popup.el   // => the jQuery object for the entire popup
    popup.body // => the jQuery object for where the content is stored (use for interacting with content)

### Popup events

There are 4 built in events to the popups: close, x, complete, show. Close is any time the popup is closed,
regardless of success, x is only if it's closed out via the x or escaping, complete is fired automatically whenever
an element with the class `.button` is hit within the popup. In any instance the event callback is given the popup
object itself.
