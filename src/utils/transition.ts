import { Point } from './point'

export type Steps<T> = Array<[number, T]>

export type StepperReturn<T> = {
  data: T
  done: boolean
  elapsed: number
}

export type Stepper<T = {}> = {
  id: string
  next: (time: number) => StepperReturn<T>
  reset: () => void
}

const getId = (() => {
  let id = 0
  return () => String(id++)
})()

export const makeStepper = <T>(
  steppingFunction: ((elapsed: number) => { data?: T; done: boolean }),
): Stepper<T> => {
  let elapsed = 0
  const next = (time: number) => {
    elapsed += time
    const stepper = steppingFunction(elapsed) as StepperReturn<T>
    stepper.elapsed = elapsed
    return stepper
  }
  const reset = () => {
    elapsed = 0
  }
  return { next, reset, id: getId() }
}

export const makeStepperFromSteps = <T>(steps: Steps<T>): Stepper<T> => {
  let currentStep = 0
  let elapsed = 0
  let [threshold, data] = steps[currentStep]

  const next = (time: number) => {
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
  const reset = () => {
    elapsed = 0
  }
  return { next, reset, id: getId() }
}

export const evenSteps = <T>(values: T[], interval: number) =>
  values.map(data => [interval, data] as [number, T])

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
  return makeStepper((elapsed: number) => {
    const progress = elapsed / duration
    return {
      data: new Point(from.x - diffX * progress, from.y - diffY * progress),
      done: elapsed >= duration,
    }
  })
}
