import { Point } from './point'
import { Steps, Stepper } from 'components/Transition'

type MakeStepperOptions = {
  useTicks?: boolean
  useDeltaTime?: boolean
}

type MakeStepperInput<T> =
  | ({
      steps: Steps<T>
      stepsData?: T[]
      stepDuration?: number
      steppingFunction?: Stepper<T>
    } & MakeStepperOptions)
  | ({
      steps?: Steps<T>
      stepsData: T[]
      stepDuration: number
      steppingFunction?: Stepper<T>
    } & MakeStepperOptions)
  | ({
      steps?: Steps<T>
      stepsData?: T[]
      stepDuration?: number
      steppingFunction: Stepper<T>
    } & MakeStepperOptions)

export type StepTime = { deltaTime?: number; elapsedMS?: number }

export type StepperFunc<T> = ((
  time: number,
) => {
  data: T
  done: boolean
  elapsed: number
})

export const makeStepper = <T>(input: MakeStepperInput<T>): StepperFunc<T> => {
  if (typeof input.steppingFunction === 'function') {
    const { steppingFunction } = input
    let elapsed = 0
    return time => {
      elapsed += time
      const result = steppingFunction(elapsed) as ReturnType<StepperFunc<T>>
      result.elapsed = elapsed
      return result
    }
  } else {
    const steps = getSteps(input)
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
}

const getSteps = <T>(input: MakeStepperInput<T>) => {
  if (input.steps) {
    return input.steps
  } else if (input.stepsData && input.stepDuration !== undefined) {
    return input.stepsData.map(data => [input.stepDuration, data] as [number, T])
  } else {
    console.warn('No steps or stepsData', input)
    return []
  }
}

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
