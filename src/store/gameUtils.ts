import { Point } from 'pixi.js'
import { Direction } from 'store/game'
import { getNextPosition } from 'store/gameTransforms/move'

export const canMove = (
  position: Point,
  direction: Direction,
  collisions: boolean[][],
) => {
  const { x, y } = getNextPosition(position, direction)
  const column = collisions[x]
  if (column === undefined) {
    return undefined
  }
  return column[y]
}
