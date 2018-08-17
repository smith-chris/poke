import keyboardjs from 'keyboardjs'
import { actions, store } from 'store/store'
import { Direction } from 'store/game'
import { canMove } from 'components/Map'
import { stage, SCREEN_SIZE } from 'app/app'
import { Point } from 'utils/point'

const moveQueue = new Map()

const handleKeyPress = (direction: Direction, keyName?: string) => {
  const {
    game: { controls, player },
  } = store.getState()
  if (controls.move === undefined) {
    actions.moveKeyPress(direction)
    if (player.destination === undefined && canMove(player.position, direction)) {
      actions.moveStart(direction)
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

const globalToKey = ({ x, y }: Point) => {
  const dX = x - SCREEN_SIZE / 2
  const dY = y - SCREEN_SIZE / 2
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

type PointerEvent = { data: { global: Point } }

stage.interactive = true
stage.on('pointerdown', ({ data: { global } }: PointerEvent) => {
  const direction = globalToKey(global)
  handleKeyPress(direction)
})

stage.on('pointerup', ({ data: { global } }: PointerEvent) => {
  const direction = globalToKey(global)
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
