class Tal.PopupGroup extends Array
  @defaults: 
    nextAnimation: 'slide'
    showAnimation: 'shrink'
    
  constructor: (args...) ->
    @name = args[0]?.name
    popup = args.pop()
    while popup instanceof Tal.Popup
      @add(popup)
      popup = args.pop()
    
    if Tal.isArray(popup)
      @add(popup...)
      popup = args.pop()
    
    @args = $.extend {}, PopupGroup.defaults, (popup||{})
    @active = false
  
  add: (args...) ->
    for popup in args
      popup = new Tal.Popup(popup)
      popup.group = this
      Array::push.call(this,popup)
    unless @current?
      @current = this[0]
    this
  
  push: @::add
  
  shift: (args...) ->
    for popup in args
      popup = new Tal.Popup(popup)
      popup.group = this
      Array::shift.call(this,popup)
    unless @current?
      @current = this[0]
    this
  
  show: ->
    @active = true
    @current?.show(@args.showAnimation)
    this
  
  close: ->
    @current.close(@args.showAnimation)
    this
  
  closing: (popup) ->
    @active = false
    if @isLast(popup)
      @finish()
    
  isLast: (popup) ->
    this[this.length-1] is popup
  
  currentIndex: ->
    this.indexOf(@current)
  
  next: ->
    if @current == this[0] && !@active
      return @show()
    
    next = this[@currentIndex()+1]
    unless next?
      return @close()
    console.log(@current.name,next.name)
    @current.close(true,@args.nextAnimation)
    next.show(@args.nextAnimation)
    @current = next
    this
  
  previous: ->
    if @current == this[0]
      return @hide()
    
    prev = this[@currentIndex()-1]
    
    @current.close(true,@args.nextAnimation)
    prev.show(@args.nextAnimation)
    @current = prev
    this
  
  finish: ->