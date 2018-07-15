import keyboardjs from 'keyboardjs'
import { actions, store } from 'store/store'
import { Direction } from 'store/game'
import { canMove } from 'components/Game'

const moveQueue = new Map()

Object.entries({
  up: Direction.N,
  down: Direction.S,
  left: Direction.W,
  right: Direction.E,
}).forEach(([keyName, direction]) => {
  keyboardjs.bind(
    keyName,
    e => {
      if (e) {
        e.preventRepeat()
      }
      const {
        game: { controls, player },
      } = store.getState()
      if (controls.move === undefined) {
        actions.moveKeyPress(direction)
        if (player.destination === undefined && canMove(player.position, direction)) {
          actions.moveStart(direction)
        }
      } else {
        moveQueue.set(keyName, direction)
      }
    },
    () => {
      if (store.getState().game.controls.move === direction) {
        if (moveQueue.size > 0) {
          const [key, value]: [string, Direction] = moveQueue.entries().next().value
          actions.moveKeyPress(value)
          moveQueue.delete(key)
        } else {
          actions.moveKeyRelease()
        }
      } else {
        moveQueue.delete(keyName)
      }
    },
  )
})
