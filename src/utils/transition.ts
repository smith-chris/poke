import { Point } from './point'
import { Steps } from 'components/Transition'

export type StepperFunc<T> = ((
  time: number,
) => {
  data: T
  done: boolean
  elapsed: number
})

export const makeStepper = <T>(steppingFunction:  ((elapsed: number) => { data?: T; done: boolean })): StepperFunc<T> => {
    let elapsed = 0
    return time => {
      elapsed += time
      const result = steppingFunction(elapsed) as ReturnType<StepperFunc<T>>
      result.elapsed = elapsed
      return result
    }
  }
}

export const makeStepperFromSteps = <T>(steps: Steps<T>): StepperFunc<T> => {
  let currentStep = 0
  let elapsed = 0
  let [threshold, data] = steps[currentStep]

  return time => {
    elapsed += time
    while (elapsed >= threshold) {
      currentStep++
      if (currentStep > steps.length - 1) {
        currentStep = 0
        threshold = steps[0][0]
        data = steps[0][1]
        return { data, done: true, elapsed }
      } else {
        threshold += steps[currentStep][0]
        data = steps[currentStep][1]
      }
    }
    return { data, done: false, elapsed }
  }
}

export const evenSteps = <T>(values: T[], interval: number) => values.map(data => [interval, data] as [number, T])

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
