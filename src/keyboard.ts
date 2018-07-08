import keyboardjs from 'keyboardjs'
import { actions } from 'store/store'
import { Direction } from 'store/game'

keyboardjs.bind('up', () => {
  actions.move(Direction.N)
})

keyboardjs.bind('down', () => {
  actions.move(Direction.S)
})

keyboardjs.bind('left', () => {
  actions.move(Direction.W)
})

keyboardjs.bind('right', () => {
  actions.move(Direction.E)
})
