GC.popupEvent = (name,type) ->
  GC.popupEvent._store[name] ||= {}
  GC.popupEvent._store[name][type] ||= new GC.Event({name: "popup_#{name}_#{type}"})
GC.onPopupEvent = (name, type, func) ->
  GC.popupEvent(name,type).push(func)
GC.popupEvent._store = {}
