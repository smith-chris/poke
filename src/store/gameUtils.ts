import { Point } from 'pixi.js'
import { Direction } from 'store/gameTypes'

export const willCollide = ({ x, y }: Point, collisions: boolean[][]) => {
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
    return Direction[firstLetter as keyof typeof Direction] as Direction
  } else {
    console.warn('Couldnt find direction for ', input)
    return undefined
  }
}
