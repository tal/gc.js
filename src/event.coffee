foo(args...)

class GC.Event extends Array
  constructor: (args...) ->
    this[key] = value for key,value of Event.defaults
    while func = args.pop() && GC.isFunction(func)
      this.unshift(func)
    if GC.isArray(func)
      arr = func
      this.push for func in arr
    
    this.fired = false;
    
    if opts = args.pop()
      this[key] = value for key,value of opts
  
  @defaults = {};
  
  fire: (args...) =>
    this.fire_args = args;
    succ = true
    for func in this
      ret = func(args...)
      succ = ret if ret is false
    
    this.fired = true;
    
    if this.once
      this.push = this._fire_the_args
    
    succ
  
  _fire_the_args: (args...) ->
    succ = true
    for arg in args
      ret = arg(this.fire_args...)
      succ = ret if ret is false
      
    Array::push.apply(this,args)
    succ
  
  bind: ->
    this.push(arguments...)