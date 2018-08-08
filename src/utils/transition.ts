import { Point } from './point'

type CreatePointStepperParams = {
  from: Point
  to: Point
  duration: number
}

export const createPointStepper = ({
  from,
  to,
  duration,
}: CreatePointStepperParams) => {
  const diffX = from.x - to.x
  const diffY = from.y - to.y
  return (elapsed: number) => {
    const progress = elapsed / duration
    return {
      data: new Point(from.x - diffX * progress, from.y - diffY * progress),
      done: elapsed >= duration,
    }
  }
}
