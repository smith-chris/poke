import { Rectangle } from 'utils/point'
import { mapRectangle, getTilesAmountWidth, getTilesAmountHeight } from './tileUtils'

describe('mapRectangle', () => {
  it('should produce correct coordinates', () => {
    const testRect = new Rectangle(5, 5, 10, 10)
    let minX = 100
    let maxX = 0
    mapRectangle(testRect, (x, y) => {
      if (x < minX) {
        minX = x
      }
      if (x > maxX) {
        maxX = x
      }
    })
    expect(maxX - minX).toBe(10)
  })
})

describe('getTileNumWidth', () => {
  it('should produce correct values', () => {
    expect(getTilesAmountWidth(87.14)).toBe(12)
  })
  it('should produce correct values', () => {
    expect(getTilesAmountWidth(95.7)).toBe(12)
  })
  it('should produce correct values', () => {
    expect(getTilesAmountWidth(104)).toBe(14)
  })
})

describe('getTileNumHeight', () => {
  it('should produce correct values', () => {
    expect(getTilesAmountHeight(84)).toBe(11)
  })
  it('should produce correct values', () => {
    expect(getTilesAmountHeight(125)).toBe(17)
  })
})
