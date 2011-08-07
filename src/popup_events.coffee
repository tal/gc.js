Tal.popupEvent = (name,type) ->
  Tal.popupEvent._store[name] ||= {}
  Tal.popupEvent._store[name][type] ||= new Tal.Event({name: "popup_#{name}_#{type}"})
Tal.onPopupEvent = (name, type, func) ->
  Tal.popupEvent(name,type).push(func)
Tal.popupEvent._store = {}
