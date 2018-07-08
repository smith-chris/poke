import { Direction } from '../game'
import { Point } from 'pixi.js'
import { assertNever } from 'utils/other'

export const move = (direction: Direction, position: Point) => {
  switch (direction) {
    case Direction.N:
      return new Point(position.x, position.y + 4)
    case Direction.E:
      return new Point(position.x - 4, position.y)
    case Direction.W:
      return new Point(position.x + 4, position.y)
    case Direction.S:
      return new Point(position.x, position.y - 4)
    default:
      return assertNever(direction)
  }
}
