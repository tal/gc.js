class GC.Tooltip
  constructor: (@el,args) ->
    if @el.size?()
      @$el = @el
      @el = @el[0]
    else
      @$el = $(@el)
    
    return Tooltip[@el] if Tooltip[@el]

    @data = $.merge({},args||{},@$el.data())

    Tooltip[@el] = this

  
  open: ->
    

  @init: ->
    tooltip = $("""<div id="tal_tooltip"></div>""").hide().css({position:'absolute'})
    Tooltip::$tooltip = tooltip
    $('body').append(tooltip).delegate '.tooltip','hover', (ev) ->
      Tooltip.open(this)
    Tooltip.init = ->
  
  @open: ->
    @tooltip.css
      top: 5