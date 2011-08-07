class Tal.Event extends Array
  constructor: (args...) ->
    this[key] = value for key,value of Event.defaults
    while func = args.pop() && Tal.isFunction(func)
      this.unshift(func)
    if Tal.isArray(func)
      arr = func
      this.push for func in arr
    
    if opts = args.pop()
      this[key] = value for key,value of opts
  
  @defaults = {};
  
  fire: (args...) ->
    this.fire_args = args;
    func(args...) for func in this
    if this.once
      this.push = (args...) =>
        arg(this.fire_args) for arg in args
        Array::push.apply(this,args)
  
  fire: ->
    this.push(arguments...)