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

export const movePlayerContinue = ({ player, currentMap, controls }: GameState) => {
  if (!player.destination || !currentMap.center) {
    console.warn('No current map or destination!', currentMap, player)
    return {}
  }

  if (
    controls.move !== undefined &&
    canMove(player.destination, controls.move, currentMap.center.collisions)
  ) {
    return {
      position: player.destination,
      destination: getNextPosition(player.destination, controls.move),
      direction: controls.move,
      moved: true,
    }
  } else {
    return {}
  }
}

export const movePlayerEnd = ({ player }: GameState) => {
  if (!player.destination) {
    return player
  }
  return {
    position: player.destination,
    direction: player.direction,
    moved: true,
  }
}
