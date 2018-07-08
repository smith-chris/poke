import { Point } from './point'

export const pointsEqual = (pA: Point, pB?: Point) => {
  if (!pB) {
    console.warn('Point B not defined, returning false...')
    return false
  }
  return pA.x === pB.x && pA.y === pB.y
}

export const roundPoint = (p: Point) => new Point(Math.round(p.x), Math.round(p.y))
