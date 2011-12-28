GC.Popup.animations =
  open:
    drop: (el, args, callback) ->
      speed = args.openSpeed
      top = el.css('top')
      el.css top: el.outerHeight()*-1

      el.show().animate {top: top}, speed, ->
        el.css('top','')
        callback?()

      el
    instant: (el, args, callback) ->
      el.show()
      callback?()
      el
    slide: (el, args, callback) ->
      speed = args.openSpeed

      left = (GC.Popup.$popups.width()-el.width())/2

      el.css margin: 0, left: (el.width() + GC.Popup.$popups.width()), position: 'absolute'
      el.show()
      el.animate {left: left}, speed, ->
        el.css margin: '0 auto', left: 0, position: ''
        callback?()

      el
    shrink: (el, args, callback) ->
      speed = args.openSpeed

      goto =
        width: el.width()
        height: el.height()
        top: +el.css('top').replace('px','')
        opacity: 1

      pos =
        width: 0 + 'px'
        height: 0 + 'px'
        top: goto.top + (goto.height/2) + 'px'
        opacity: 0

      el.css(pos)
      el.show()
      el.animate goto, speed, ->
        callback?()
        el.css('height','')

      el
  close:
    drop: (el, args, callback) ->
      speed = args.openSpeed

      el.animate {top: el.outerHeight()*-1}, speed, ->
        el.hide().css('top','')
        callback?()

      el
    instant: (el, args, callback) ->
      el.hide()
      callback?()
      el
    slide: (el, args, callback) ->
      speed = args.closeSpeed

      el.css margin: 0, left: el.offset().left, position: 'absolute'

      el.animate {left: ((el.width()-50) * -1)+'px'}, speed, ->
        el.hide().css margin: '0 auto', left: 0, position: ''
        callback?()

      el
    shrink: (el, args, callback) ->
      speed = args.closeSpeed
      pos = {}
      pos.width = el.width()
      pos.height = el.height()
      pos.top = +el.css('top').replace('px','')
      pos.opacity = 1
      el.css(pos)

      goto = {}
      goto.width = 0 + 'px'
      goto.height = 0 + 'px'
      goto.top = pos.top + (pos.height/2) + 'px'
      goto.opacity = 0

      el.animate goto, speed, ->
        callback?()
        el.css(pos).css('height','')
        el.hide()

      el