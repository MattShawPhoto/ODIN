import Mousetrap from 'mousetrap'
import evented from '../evented'
import selection from './App.selection'

let clipboard = {}

// Behavior is defined through these callbacks:
//  escape: event -> unit
//  delete: event -> unit
//  click (map): event -> unit

let defaultBehavior
let secondaryBehavior
const behavior = () => secondaryBehavior || defaultBehavior

const dispatch = (handler, event) => {
  if (!behavior()[handler]) return
  behavior()[handler](event)
}

const push = behavior => (secondaryBehavior = behavior)
const pop = () => (secondaryBehavior = null)

const init = map => {

  Mousetrap.bind(['escape'], event => {
    dispatch('escape', event)
  })

  Mousetrap.bind('command+backspace', event => {
    dispatch('delete', event)
  })

  Mousetrap.bind('del', event => {
    dispatch('delete', event)
  })

  map.on('click', event => {
    dispatch('click', event)
  })

  // Clipbaord.

  Mousetrap.bind(['mod+c'], () => {
    if (!selection.selected()) return
    if (!selection.selected().copy) return
    clipboard = selection.selected().copy()
  })

  Mousetrap.bind(['mod+x'], () => {
    if (!selection.selected()) return
    if (!selection.selected().cut) return
    clipboard = selection.selected().cut()
  })

  Mousetrap.bind(['mod+v'], () => {
    const { type, ...properties } = clipboard
    if (!type) return
    evented.emit('CLIPBOARD_PASTE', type, properties)
  })

  defaultBehavior = {
    escape: () => selection.deselect(),
    delete: () => {
      // When selection has delete interface -> do it!
      if (!selection.selected()) return
      if (!selection.selected().delete) return
      selection.selected().delete()
    },
    click: () => selection.deselect()
  }
}

export default {
  init,
  push,
  pop
}