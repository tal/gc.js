# tal.js

### Events

For basic event fireing

    obj = {};
    obj.onClick = new Tal.event();
    obj.onClick.bind(function(a) {console.log("omg I was clicked "+a)});
    obj.onClick.fire("by a madman");
    // => omg I was clicked by a madman
    obj.onClick.bind(function(a) {console.log("omg I was touched "+a)});
    obj.onClick.fire("nice guy");
    // => omg I was clicked by a nice guy
    // => omg I was touched by a nice guy

If you want the event to be a wait, ie the event is probably only fired once

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
