if (!window.GC) window.GC = new (function GC() {})();

(function() {
  this.isArray = Array.isArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };
  this.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };
  this.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };
}).call(GC);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  foo.apply(null, args);

  GC.Event = (function(_super) {

    __extends(Event, _super);

    function Event() {
      var args, arr, func, key, opts, value, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.fire = __bind(this.fire, this);
      _ref = Event.defaults;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      while (func = args.pop() && GC.isFunction(func)) {
        this.unshift(func);
      }
      if (GC.isArray(func)) {
        arr = func;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          func = arr[_i];
          this.push;
        }
      }
      this.fired = false;
      if (opts = args.pop()) {
        for (key in opts) {
          value = opts[key];
          this[key] = value;
        }
      }
    }

    Event.defaults = {};

    Event.prototype.fire = function() {
      var args, func, ret, succ, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.fire_args = args;
      succ = true;
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        func = this[_i];
        ret = func.apply(null, args);
        if (ret === false) succ = ret;
      }
      this.fired = true;
      if (this.once) this.push = this._fire_the_args;
      return succ;
    };

    Event.prototype._fire_the_args = function() {
      var arg, args, ret, succ, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      succ = true;
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        ret = arg.apply(null, this.fire_args);
        if (ret === false) succ = ret;
      }
      Array.prototype.push.apply(this, args);
      return succ;
    };

    Event.prototype.bind = function() {
      return this.push.apply(this, arguments);
    };

    return Event;

  })(Array);

  GC.popupEvent = function(name, type) {
    var _base, _base2;
    (_base = GC.popupEvent._store)[name] || (_base[name] = {});
    return (_base2 = GC.popupEvent._store[name])[type] || (_base2[type] = new GC.Event({
      name: "popup_" + name + "_" + type
    }));
  };

  GC.onPopupEvent = function(name, type, func) {
    return GC.popupEvent(name, type).push(func);
  };

  GC.popupEvent._store = {};

  GC.Popup = (function() {
    var $body, i;

    Popup.defaults = {
      width: 774,
      overlayOpacity: 0.7,
      overlaySpeed: 500,
      closeSpeed: 200,
      closeAnimation: 'shrink',
      lock: true
    };

    Popup.$overlay = $("<div id='tal_popup_overlay'></div>").hide();

    Popup.$popups = $('<div id="tal_popups"></div>');

    $body = $();

    $(function() {
      $body = $('body');
      return $body.append(Popup.$overlay).append(Popup.$popups);
    });

    Popup.structure = "<div class=\"simple_popup\">\n  <div class=\"container\">\n    <a href=\"#\" class=\"close\"></a>\n  </div>\n\n</div>";

    Popup.find = {};

    Popup.s = [];

    i = 1;

    function Popup(args) {
      this.afterHideOverlay = __bind(this.afterHideOverlay, this);
      var name, _i, _len, _ref,
        _this = this;
      if (args instanceof Popup) return args;
      this.name = (args != null ? args.name : void 0) || i++;
      this.args = $.extend({}, Popup.defaults, args);
      this.el = $(Popup.structure);
      this.el.width(this.args.width);
      if (this.name) {
        if (Popup.find[this.name]) {
          if (GC.log) {
            console.error("There's already a popup of name " + this.name);
          }
          return Popup.find[this.name];
        }
        Popup.find[this.name] = this;
        this.el.attr('id', "tal_popup" + this.name);
      }
      _ref = ['complete', 'show', 'x', 'close'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        this.getEvent(name);
        if (this.args['on' + name]) {
          this.getEvent(name).push(this.args['on' + name]);
        }
      }
      this.active = false;
      this.body = $("<div class='content'></div>");
      this.el.find('.container').append(this.body);
      this.close_button = this.el.delegate('.close', 'click', function(e) {
        e.preventDefault();
        return _this.x(e);
      });
      this.button = this.el.delegate('.button', 'click', function(e) {
        e.preventDefault();
        return _this.complete(e);
      });
      if (this.args.body || this.args.html) {
        this.body.html(this.args.body || this.args.html);
      }
      if (this.args.text) this.body.text(this.args.text);
      if (this.args.url) this.body.load(this.args.url);
      this.el.hide();
      Popup.$popups.append(this.el);
      Popup.s.push(this);
    }

    Popup.prototype.hideOverlay = function() {
      return Popup.$overlay.fadeOut(this.args.overlaySpeed, this.afterHideOverlay);
    };

    Popup.prototype.afterHideOverlay = function() {
      $body.css({
        overflow: '',
        'padding-right': ''
      });
      return Popup.$popups.removeClass('active');
    };

    Popup.prototype.showOverlay = function() {
      var $o, origWidth,
        _this = this;
      if (this.args.lock) {
        origWidth = $body.width();
        $o = Popup.$overlay.filter(':hidden');
        $o.show();
        $body.css({
          overflow: 'hidden'
        });
        $body.css({
          'padding-right': $body.width() - origWidth
        });
        $o.fadeTo(0, 0.0, function() {
          return $o.fadeTo(_this.args.overlaySpeed, _this.args.overlayOpacity);
        });
      }
      return Popup.$popups.addClass('active');
    };

    Popup.prototype.getEvent = function(eventName) {
      var _name;
      if (GC.popupEvent == null) return;
      return this[_name = "on" + eventName] || (this[_name] = this.name != null ? GC.popupEvent(this.name, eventName) : new GC.Event());
    };

    Popup.prototype.fireEvents = function(eventName) {
      var succ;
      succ = true;
      if ((typeof optimizely !== "undefined" && optimizely !== null) && (this.name != null)) {
        optimizely.trackEvent("popup_" + this.name + "_event_" + eventName);
      }
      if (GC.popupEvent != null) {
        succ = this.getEvent(eventName).fire(this, eventName);
        GC.popupEvent("all", eventName).fire(this, eventName);
      }
      if (typeof _gaq !== "undefined" && _gaq !== null) {
        _gaq.push(['_trackEvent', 'tal_popups', eventName, this.name]);
      }
      return succ;
    };

    Popup.prototype.show = function() {
      var animationName, args, callback, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.fireEvents('show');
      if (this.args.noClose) this.close_button.hide();
      animationName = GC.isString(args[0]) ? args.shift() : this.args.openAnimation;
      callback = GC.isFunction(args[0]) ? args.shift() : function() {};
      if (Popup._active) {
        Popup._active.close(true);
      } else {
        this.showOverlay();
      }
      try {
        if ((_ref = GC.Popup.animations) != null ? _ref.open[animationName] : void 0) {
          GC.Popup.animations.open[animationName](this.el, this.args, callback);
        } else {
          this.el.show();
          callback();
        }
      } catch (error) {
        if (GC.log) console.error(error);
        this.el.show();
        callback();
      }
      this.active = true;
      Popup._active = this;
      return this;
    };

    Popup.prototype.complete = function() {
      return this.fireEvents('complete');
    };

    Popup.prototype.x = function() {
      this.fireEvents('x');
      return this.close.apply(this, arguments);
    };

    Popup.prototype.close = function() {
      var animationName, args, callback;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.fireEvents('close') === false) return false;
      if (args[0] === true) {
        args.shift();
      } else {
        this.hideOverlay();
      }
      animationName = GC.isString(args[0]) ? args.shift() : this.args.closeAnimation;
      callback = GC.isFunction(args[0]) ? args.shift() : function() {};
      try {
        if ((GC.Popup.animations != null) && GC.Popup.animations.close[animationName]) {
          GC.Popup.animations.close[animationName](this.el, this.args, callback);
        } else {
          this.el.hide();
          callback();
        }
      } catch (error) {
        if (GC.log) console.error(error);
        this.el.hide();
        callback();
      }
      this.active = false;
      Popup._active = null;
      if (this.group) this.group.closing(this);
      return this;
    };

    Popup.prototype.remove = function() {
      var idx;
      if (this.active) this.close();
      idx = Popup.s.indexOf(this);
      if (idx !== -1) Popup.s.splice(idx, 1);
      this.el.remove();
      return null;
    };

    return Popup;

  })();

  GC.Popup.animations = {
    open: {
      drop: function(el, args, callback) {
        var speed, top;
        speed = args.openSpeed;
        top = el.css('top');
        el.css({
          top: el.outerHeight() * -1
        });
        el.show().animate({
          top: top
        }, speed, function() {
          el.css('top', '');
          return typeof callback === "function" ? callback() : void 0;
        });
        return el;
      },
      instant: function(el, args, callback) {
        el.show();
        if (typeof callback === "function") callback();
        return el;
      },
      slide: function(el, args, callback) {
        var left, speed;
        speed = args.openSpeed;
        left = (GC.Popup.$popups.width() - el.width()) / 2;
        el.css({
          margin: 0,
          left: el.width() + GC.Popup.$popups.width(),
          position: 'absolute'
        });
        el.show();
        el.animate({
          left: left
        }, speed, function() {
          el.css({
            margin: '0 auto',
            left: 0,
            position: ''
          });
          return typeof callback === "function" ? callback() : void 0;
        });
        return el;
      },
      shrink: function(el, args, callback) {
        var goto, pos, speed;
        speed = args.openSpeed;
        goto = {
          width: el.width(),
          height: el.height(),
          top: +el.css('top').replace('px', ''),
          opacity: 1
        };
        pos = {
          width: 0 + 'px',
          height: 0 + 'px',
          top: goto.top + (goto.height / 2) + 'px',
          opacity: 0
        };
        el.css(pos);
        el.show();
        el.animate(goto, speed, function() {
          if (typeof callback === "function") callback();
          return el.css('height', '');
        });
        return el;
      }
    },
    close: {
      drop: function(el, args, callback) {
        var speed;
        speed = args.openSpeed;
        el.animate({
          top: el.outerHeight() * -1
        }, speed, function() {
          el.hide().css('top', '');
          return typeof callback === "function" ? callback() : void 0;
        });
        return el;
      },
      instant: function(el, args, callback) {
        el.hide();
        if (typeof callback === "function") callback();
        return el;
      },
      slide: function(el, args, callback) {
        var speed;
        speed = args.closeSpeed;
        el.css({
          margin: 0,
          left: el.offset().left,
          position: 'absolute'
        });
        el.animate({
          left: ((el.width() - 50) * -1) + 'px'
        }, speed, function() {
          el.hide().css({
            margin: '0 auto',
            left: 0,
            position: ''
          });
          return typeof callback === "function" ? callback() : void 0;
        });
        return el;
      },
      shrink: function(el, args, callback) {
        var goto, pos, speed;
        speed = args.closeSpeed;
        pos = {};
        pos.width = el.width();
        pos.height = el.height();
        pos.top = +el.css('top').replace('px', '');
        pos.opacity = 1;
        el.css(pos);
        goto = {};
        goto.width = 0 + 'px';
        goto.height = 0 + 'px';
        goto.top = pos.top + (pos.height / 2) + 'px';
        goto.opacity = 0;
        el.animate(goto, speed, function() {
          if (typeof callback === "function") callback();
          el.css(pos).css('height', '');
          return el.hide();
        });
        return el;
      }
    }
  };

  GC.PopupGroup = (function(_super) {

    __extends(PopupGroup, _super);

    PopupGroup.defaults = {
      nextAnimation: 'slide',
      showAnimation: 'shrink'
    };

    function PopupGroup() {
      var args, popup, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.name = (_ref = args[0]) != null ? _ref.name : void 0;
      popup = args.pop();
      while (popup instanceof GC.Popup) {
        this.add(popup);
        popup = args.pop();
      }
      if (GC.isArray(popup)) {
        this.add.apply(this, popup);
        popup = args.pop();
      }
      this.args = $.extend({}, PopupGroup.defaults, popup || {});
      this.active = false;
    }

    PopupGroup.prototype.add = function() {
      var args, popup, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        popup = args[_i];
        popup = new GC.Popup(popup);
        popup.group = this;
        Array.prototype.push.call(this, popup);
      }
      if (this.current == null) this.current = this[0];
      return this;
    };

    PopupGroup.prototype.push = PopupGroup.prototype.add;

    PopupGroup.prototype.shift = function() {
      var args, popup, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        popup = args[_i];
        popup = new GC.Popup(popup);
        popup.group = this;
        Array.prototype.shift.call(this, popup);
      }
      if (this.current == null) this.current = this[0];
      return this;
    };

    PopupGroup.prototype.show = function() {
      var _ref;
      this.active = true;
      if ((_ref = this.current) != null) _ref.show(this.args.showAnimation);
      return this;
    };

    PopupGroup.prototype.close = function() {
      this.current.close(this.args.showAnimation);
      return this;
    };

    PopupGroup.prototype.closing = function(popup) {
      this.active = false;
      if (this.isLast(popup)) return this.finish();
    };

    PopupGroup.prototype.isLast = function(popup) {
      return this[this.length - 1] === popup;
    };

    PopupGroup.prototype.currentIndex = function() {
      return this.indexOf(this.current);
    };

    PopupGroup.prototype.next = function() {
      var next;
      if (this.current === this[0] && !this.active) return this.show();
      next = this[this.currentIndex() + 1];
      if (next == null) return this.close();
      console.log(this.current.name, next.name);
      this.current.close(true, this.args.nextAnimation);
      next.show(this.args.nextAnimation);
      this.current = next;
      return this;
    };

    PopupGroup.prototype.previous = function() {
      var prev;
      if (this.current === this[0]) return this.hide();
      prev = this[this.currentIndex() - 1];
      this.current.close(true, this.args.nextAnimation);
      prev.show(this.args.nextAnimation);
      this.current = prev;
      return this;
    };

    PopupGroup.prototype.finish = function() {};

    return PopupGroup;

  })(Array);

}).call(this);
