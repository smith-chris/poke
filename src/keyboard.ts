import keyboardjs from 'keyboardjs'
import { actions, store } from 'store/store'
import { DEBUG_MAP } from 'app/app'
import { moveIntent } from 'store/gameTransforms/moveIntent'
import { Direction } from 'store/gameTypes'

const moveQueue = new Map()

const handleKeyPress = (direction: Direction, keyName?: string) => {
  const { game } = store.getState()
  if (game.controls.move === undefined) {
    actions.moveKeyPress(direction)
    if (DEBUG_MAP) {
      const map = game.currentMap[direction]
      if (map) {
        actions.loadMap({ mapName: map.name })
      }
      return
    }
    if (game.player.destination === undefined) {
      moveIntent(game, actions, direction)
    }
  } else if (keyName) {
    moveQueue.set(keyName, direction)
  }
}

const handleKeyRelease = (direction: Direction, keyName?: string) => {
  if (store.getState().game.controls.move === direction) {
    if (moveQueue.size > 0) {
      const [key, value]: [string, Direction] = moveQueue.entries().next().value
      actions.moveKeyPress(value)
      moveQueue.delete(key)
    } else {
      actions.moveKeyRelease()
    }
  } else if (keyName) {
    moveQueue.delete(keyName)
  }
}

type P = { x: number; y: number }
const globalToKey = ({ x, y }: P) => {
  const dX = x - window.innerWidth / 2
  const dY = y - window.innerHeight / 2
  const angle = Math.atan2(dY, dX) * (180 / Math.PI) + 180
  if (angle > 45 && angle <= 135) {
    return Direction.N
  } else if (angle > 135 && angle <= 225) {
    return Direction.E
  } else if (angle > 225 && angle <= 315) {
    return Direction.S
  } else {
    return Direction.W
  }
}

window.addEventListener('pointerdown', e => {
  const direction = globalToKey(e)
  handleKeyPress(direction)
})

window.addEventListener('touchstart', e => {
  // @ts-ignore
  const direction = globalToKey({ x: e.pageX, y: e.pageY })
  handleKeyPress(direction)
})

window.addEventListener('touchend', e => {
  // @ts-ignore
  const direction = globalToKey({ x: e.pageX, y: e.pageY })
  handleKeyRelease(store.getState().game.controls.move || direction)
})

window.addEventListener('pointerup', e => {
  const direction = globalToKey(e)
  handleKeyRelease(store.getState().game.controls.move || direction)
})

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
      handleKeyPress(direction, keyName)
    },
    () => {
      handleKeyRelease(direction, keyName)
    },
  )
})
