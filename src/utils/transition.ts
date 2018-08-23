import { Point } from './point'
import { Steps } from 'components/Transition'
import { Omit } from './fiber'

export interface StepperFunc<T = {}> {
  id: string
  (time: number): {
    data: T
    done: boolean
    elapsed: number
  }
}

const getId = (() => {
  let id = 0
  return () => String(id++)
})()

const withId = <T extends { id: string }>(input: Omit<T, 'id'>) => {
  const result = input as T
  result.id = getId()
  return result
}

export const makeStepper = <T>(
  steppingFunction: ((elapsed: number) => { data?: T; done: boolean }),
): StepperFunc<T> => {
  let elapsed = 0
  return withId((time: number) => {
    elapsed += time
    const stepper = steppingFunction(elapsed) as ReturnType<StepperFunc<T>>
    stepper.elapsed = elapsed
    return stepper
  })
}

export const makeStepperFromSteps = <T>(steps: Steps<T>): StepperFunc<T> => {
  let currentStep = 0
  let elapsed = 0
  let [threshold, data] = steps[currentStep]

  return withId((time: number) => {
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
  })
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
  return (elapsed: number) => {
    const progress = elapsed / duration
    return {
      data: new Point(from.x - diffX * progress, from.y - diffY * progress),
      done: elapsed >= duration,
    }
  }
}
