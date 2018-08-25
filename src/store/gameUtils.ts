import { Point } from 'pixi.js'
import { Direction } from 'store/game'
import { getNextPosition } from 'store/gameTransforms/move'

export const canMove = (
  position: Point,
  direction: Direction,
  collisions: boolean[][],
) => {
  const { x, y } = getNextPosition(position, direction)
  return collisions[x][y]
}
