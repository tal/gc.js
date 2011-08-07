# tal.js

Check the downloads button on [the github](http://github.com/talby/tal.js#download_button) for a compiled version of tal.js
or compile it yourself by running `thor taljs:compile`

## Events

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

    popup = new Tal.Popup({
      width: 220,
      name: "mytest_popup",
      html: "This goes in the body of my popup"
    });
    
    popup.show();