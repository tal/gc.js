class Tal.Popup
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
  constructor: (args) ->
    @args = $.extend {}, Popup.defaults, args
    @el = $(Popup.structure)
    @el.width(@args.width)
    if @args.name
      @name = @args.name
      if Popup.find[@name]
        console.error("There's already a popup of name #{@name}") if Tal.log
        return Popup.find[@name]
      Popup.find[@name] = this
      @el.attr('id',"#{@name}_simple_popup")
  
    @active = false
  
    @body = $("<div class='content'></div>")
    @el.find('.container').append @body
    
    @close_button = @el.find('.close').click (e) =>
      e.preventDefault()
      @x(e)
  
    @button = @el.find('.button').click (e) =>
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
    if @args.lock
      $body.css overflow:'', 'padding-right': ''
    Popup.$popups.removeClass('active')
  
  showOverlay: ->
    origWidth = $body.width()
    $o = Popup.$overlay.filter(':hidden')
    if @args.lock
      $o.show()
      $body.css overflow:'hidden'
      $body.css 'padding-right': $body.width()-origWidth
      $o.fadeTo 0,0.0, =>
        $o.fadeTo(@args.overlaySpeed,@args.overlayOpacity)
    Popup.$popups.addClass('active')
  
  fireEvents: (eventName) ->
    succ = true
    if @name?
      if optimizely?
        optimizely.trackEvent("popup_#{@name}_event_#{eventName}")
      if Tal.popupEvent?
        succ = Tal.popupEvent(@name,eventName).fire(this,eventName)
    
    if Tal.popupEvent?
      Tal.popupEvent("all",eventName).fire(this,eventName)
    
    if _gaq?
      _gaq.push(['_trackEvent', 'tal_popups', eventName, @name])
    succ
  
  show: (args...) ->
    @fireEvents('show')
    @close_button.hide() if @args.noClose
    if _.isString(args[0])
      animationName = args.shift()
    else
      animationName = @args.openAnimation
    
    if _.isFunction(args[0])
      callback = args.shift()
    else
      callback = ->
    
    if Popup._active
      Popup._active.close(true)
    else
      @showOverlay()
    
    try
      if Tal.Popup.animations? && Tal.Popup.animations.open[animationName]
        Tal.Popup.animations.open[animationName](@el,@args,callback)
      else
        @el.show()
        callback()
    catch error
      console.error(error) if Tal.log
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

    animationName = if _.isString(args[0]) then args.shift() else @args.closeAnimation
    callback = if _.isFunction(args[0]) then args.shift() else ->

    try
      if Tal.Popup.animations? && Tal.Popup.animations.close[animationName]
        Tal.Popup.animations.close[animationName](@el,@args,callback)
      else
        @el.hide()
        callback()
    catch error
      console.error(error) if Tal.log
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
    