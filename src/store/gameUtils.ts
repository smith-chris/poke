import { Point } from 'pixi.js'
import { Direction } from 'store/gameTypes'
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

export const toDirection = (input: string) => {
  // tslint:disable-next-line
  const firstLetter: any = typeof input === 'string' && input[0].toUpperCase()
  if (firstLetter) {
    return Direction[firstLetter] as Direction
  } else {
    console.warn('Couldnt find direction for ', input)
    return undefined
  }
}
