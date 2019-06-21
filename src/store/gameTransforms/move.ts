import { Point } from 'pixi.js'
import { assertNever } from 'utils/assertNever'
import { pointsEqual } from 'utils/pixi'
import { willCollide } from 'store/gameUtils'
import { GameState, Direction } from 'store/gameTypes'

export const getNextPositionForDirection = (position: Point, direction: Direction) => {
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
  const destination = getNextPositionForDirection(position, direction)
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
  if (controls.move === undefined) {
    console.warn('Cant continue without direction!', controls, player)
    return {}
  }

  const newDestination = getNextPositionForDirection(player.destination, controls.move)
  if (willCollide(newDestination, currentMap.center.collisions)) {
    return {
      position: player.destination,
      destination: newDestination,
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
