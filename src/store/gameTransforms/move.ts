import { Direction, GameState } from '../game'
import { Point } from 'pixi.js'
import { assertNever } from 'utils/other'
import { pointsEqual } from 'utils/pixi'
import { canMove } from '../gameUtils'

export const getNextPosition = (position: Point, direction: Direction) => {
  switch (direction) {
    case Direction.N:
      return new Point(position.x, position.y - 1)
    case Direction.E:
      return new Point(position.x + 1, position.y)
    case Direction.W:
      return new Point(position.x - 1, position.y)
    case Direction.S:
      return new Point(position.x, position.y + 1)
    default:
      return assertNever(direction)
  }
}

export const movePlayerStart = (position: Point, direction: Direction) => {
  const destination = getNextPosition(position, direction)
  if (!pointsEqual(destination, position)) {
    return {
      destination,
      direction,
    }
  }
  return {}
}

export const movePlayerEnd = ({ player, currentMap, controls }: GameState) => {
  if (!player.destination || !currentMap) {
    return {}
  }

  let newDestination = undefined
  let newDirection = undefined
  if (
    controls.move !== undefined &&
    canMove(player.destination, controls.move, currentMap.collisions)
  ) {
    newDestination = getNextPosition(player.destination, controls.move)
    newDirection = controls.move
  }
  return {
    position: player.destination,
    destination: newDestination,
    direction: newDirection,
  }
}
