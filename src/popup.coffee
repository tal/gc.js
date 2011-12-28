class GC.Popup
  @defaults:
    width: 774
    overlayOpacity: 0.7
    overlaySpeed: 500
    closeSpeed: 200
    closeAnimation: 'shrink'
    lock: true
  @$overlay: $("<div id='tal_popup_overlay'></div>").hide()
  @$popups: $('<div id="tal_popups"></div>')
  $body = $()
  $ ->
    $body = $('body')
    $body.append(Popup.$overlay).append(Popup.$popups)
    
  @structure: """
    <div class="simple_popup">
      <div class="container">
        <a href="#" class="close"></a>
      </div>

    </div>"""
  @find = {}
  @s = []
  i = 1
  constructor: (args) ->
    if args instanceof Popup
      return args
    @name = args?.name || i++
    @args = $.extend {}, Popup.defaults, args
    @el = $(Popup.structure)
    @el.width(@args.width)
    if @name
      if Popup.find[@name]
        console.error("There's already a popup of name #{@name}") if GC.log
        return Popup.find[@name]
      Popup.find[@name] = this
      @el.attr('id',"tal_popup#{@name}")
    
    # warm up events
    for name in ['complete','show','x','close']
      @getEvent(name)
      @getEvent(name).push(@args['on'+name]) if @args['on'+name]
    
    @active = false
    
    @body = $("<div class='content'></div>")
    @el.find('.container').append @body
    
    @close_button = @el.delegate '.close', 'click', (e) =>
      e.preventDefault()
      @x(e)
  
    @button = @el.delegate '.button','click', (e) =>
      e.preventDefault()
      @complete(e)
  
    @body.html(@args.body||@args.html) if @args.body || @args.html
    @body.text(@args.text) if @args.text
    @body.load(@args.url)  if @args.url
  
    @el.hide()
    Popup.$popups.append(@el)
    Popup.s.push(this)
  
  hideOverlay: ->
    Popup.$overlay.fadeOut @args.overlaySpeed, @afterHideOverlay
  
  afterHideOverlay: =>
    $body.css overflow:'', 'padding-right': ''
    Popup.$popups.removeClass('active')
  
  showOverlay: ->
    if @args.lock
      origWidth = $body.width()
      $o = Popup.$overlay.filter(':hidden')
      $o.show()
      $body.css overflow:'hidden'
      $body.css 'padding-right': $body.width()-origWidth
      $o.fadeTo 0,0.0, =>
        $o.fadeTo(@args.overlaySpeed,@args.overlayOpacity)
    Popup.$popups.addClass('active')
  
  getEvent: (eventName) ->
    return unless GC.popupEvent?
    this["on"+eventName] ||= if @name?
      GC.popupEvent(@name,eventName)
    else
      new GC.Event()
  
  fireEvents: (eventName) ->
    succ = true
    if optimizely? and @name?
      optimizely.trackEvent("popup_#{@name}_event_#{eventName}")
    
    if GC.popupEvent?
      succ = @getEvent(eventName).fire(this,eventName)
      GC.popupEvent("all",eventName).fire(this,eventName)
    
    _gaq?.push(['_trackEvent', 'tal_popups', eventName, @name])
    
    succ
  
  show: (args...) ->
    @fireEvents('show')
    @close_button.hide() if @args.noClose
    
    animationName = if GC.isString(args[0]) then args.shift() else @args.openAnimation
    callback = if GC.isFunction(args[0]) then args.shift() else ->
      
    
    if Popup._active
      Popup._active.close(true)
    else
      @showOverlay()
    
    try
      if GC.Popup.animations?.open[animationName]
        GC.Popup.animations.open[animationName](@el,@args,callback)
      else
        @el.show()
        callback()
    catch error
      console.error(error) if GC.log
      @el.show()
      callback()
    
    @active = true
    Popup._active = this
    this
  
  complete: ->
    @fireEvents('complete')
  
  x: ->
    @fireEvents('x')
    @close(arguments...)
  
  close: (args...) ->
    if @fireEvents('close') is false
      return false
    
    if args[0] == true
      args.shift()
    else
      @hideOverlay()

    animationName = if GC.isString(args[0]) then args.shift() else @args.closeAnimation
    callback = if GC.isFunction(args[0]) then args.shift() else ->

    try
      if GC.Popup.animations? && GC.Popup.animations.close[animationName]
        GC.Popup.animations.close[animationName](@el,@args,callback)
      else
        @el.hide()
        callback()
    catch error
      console.error(error) if GC.log
      @el.hide()
      callback()

    @active = false
    Popup._active = null
    @group.closing(this) if @group

    this
  
  remove: ->
    @close() if @active
    idx = Popup.s.indexOf(this)
    Popup.s.splice(idx,1) if idx != -1
    @el.remove()
    null
    