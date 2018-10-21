import { Rectangle, Point } from 'utils/point'
import { Viewport } from './withViewport'

// tslint:disable-next-line
export const mapRectangle = <T extends any>(
  rect: Rectangle,
  f: (x: number, y: number) => T,
) => {
  const results: Exclude<T, undefined>[] = []
  for (let x = rect.x; x <= rect.width + rect.x; x++) {
    for (let y = rect.y; y <= rect.height + rect.y; y++) {
      const item = f(x, y)
      // @ts-ignore
      if (item || item === 0 || item === false) {
        // @ts-ignore
        results.push(item)
      }
    }
  }
  return results
}

export const getTilesAmountWidth = (size: number) => Math.ceil(size / 16) * 2
export const getTilesAmountHeight = (size: number) =>
  Math.floor(size / 16 + 0.5) * 2 + 1

export const getSlice = (viewport: Viewport, position: Point) => {
  const sliceWidth = getTilesAmountWidth(viewport.width) - 1
  const sliceHeight = getTilesAmountHeight(viewport.height) - 1
  const sliceX = Math.round(position.x * 2 - sliceWidth / 2)
  const sliceY = Math.round(position.y * 2 - sliceHeight / 2)
  return new Rectangle(sliceX, sliceY, sliceWidth, sliceHeight)
}
