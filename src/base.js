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
