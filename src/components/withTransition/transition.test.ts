import { makeStepper, Stepper, makeStepperFromSteps, evenSteps } from './transition'

const makeStepperAssert = <T>(stepper: Stepper<T>) => {
  let totalElapsed = 0
  return ({
    elapsed,
    done = false,
    data,
  }: {
    elapsed: number
    done?: boolean
    data: T
  }) => {
    totalElapsed += elapsed
    const res = stepper.next(elapsed)
    expect({ done: res.done, data: res.data, elapsed: res.elapsed }).toEqual({
      done,
      data,
      elapsed: totalElapsed,
    })
  }
}

describe('makeStepper', () => {
  it('should make stepper from stepperFunc', () => {
    const assert = makeStepperAssert(
      makeStepper((tick: number) => ({
        data: tick >= 8,
        done: tick >= 16,
      })),
    )

    assert({ elapsed: 1, data: false })
    assert({ elapsed: 6, data: false })
    assert({ elapsed: 1, data: true })
    assert({ elapsed: 8, data: true, done: true })
  })
})

describe('makeStepperFromSteps', () => {
  it('should make equal interval stepper correctly', () => {
    const assert = makeStepperAssert(makeStepperFromSteps(evenSteps([-2, 0, 3], 350)))

    assert({ elapsed: 0, data: -2 })
    assert({ elapsed: 1, data: -2 })
    assert({ elapsed: 349, data: 0 })
    assert({ elapsed: 350, data: 3 })
    assert({ elapsed: 349, data: 3 })
    assert({ elapsed: 1, data: -2, done: true })
  })

  it('should make equal interval stepper correctly - more complicated example', () => {
    const assert = makeStepperAssert(
      makeStepperFromSteps(evenSteps([-2, -1, 0, 1, 2, 1, 0, -1], 350)),
    )

    assert({ elapsed: 349, data: -2 })
    assert({ elapsed: 351, data: 0 })
    assert({ elapsed: 1040, data: 2 })
    assert({ elapsed: 9, data: 2 })
    assert({ elapsed: 1, data: 1 })
    assert({ elapsed: 1049, data: -1 })
    assert({ elapsed: 1, data: -2, done: true })
  })

  it('should make custom interval stepper correctly', () => {
    const assert = makeStepperAssert(
      makeStepperFromSteps([[700, 'a'], [350, 'b'], [350, 'c']]),
    )

    assert({ elapsed: 349, data: 'a' })
    assert({ elapsed: 351, data: 'b' })
    assert({ elapsed: 349, data: 'b' })
    assert({ elapsed: 1, data: 'c' })
    assert({ elapsed: 350, data: 'a', done: true })
  })
})
