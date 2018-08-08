import { Component, ReactNode } from 'react'
import { ticker } from 'pixi.js'

export type Steps<T> = Array<[number, T]>
export type Stepper<T> = (info: number) => { data?: T; done: boolean }

type BaseProps<T> = {
  render: (data: T, ms: number) => ReactNode
  useDeltaTime?: boolean
  useTicks?: boolean
  loop?: boolean
  onFinish?: (ms: number) => void
  onLoop?: (ms: number) => void
}

type Props<T> =
  | ({
      stepper: Stepper<T>
      steps?: Steps<T>
    } & BaseProps<T>)
  | ({
      stepper?: Stepper<T>
      steps: Steps<T>
    } & BaseProps<T>)

type State<T> = { data?: T }

export class Transition2<T> extends Component<Props<T>, State<T>> {
  ticker: ticker.Ticker
  tickerCallback: () => void

  state: State<T> = {}

  elapsed = 0

  propsDiffer = (newProps: Props<T>) => {
    const { steps, stepper } = this.props
    return steps !== newProps.steps || stepper !== newProps.stepper
  }

  canTransition(props: Props<T>) {
    const { steps, stepper } = props
    const hasSteps = steps && steps.length > 0 && steps[0].length > 1
    return hasSteps || typeof stepper === 'function'
  }

  shouldComponentUpdate(newProps: Props<T>, newState: State<T>) {
    return this.propsDiffer(newProps) || this.state.data !== newState.data
  }

  componentWillReceiveProps(newProps: Props<T>) {
    if (this.canTransition(newProps) && this.propsDiffer(newProps)) {
      this.ticker.remove(this.tickerCallback)
      this.startTransition(newProps)
    }
  }

  makeGetData = (props: Props<T>): Stepper<T> => {
    const { steps, stepper } = props

    if (typeof stepper === 'function') {
      return stepper
    } else if (steps) {
      let currentFrameIndex = 0
      let [threshold, data] = steps[currentFrameIndex]

      return (elapsed: number) => {
        if (elapsed > threshold) {
          currentFrameIndex++
          if (currentFrameIndex > steps.length - 1) {
            currentFrameIndex = 0
            threshold = steps[0][0]
            data = steps[0][1]

            return { data, done: true }
          } else {
            threshold += steps[currentFrameIndex][0]
            data = steps[currentFrameIndex][1]
          }
        }
        return { data, done: false }
      }
    } else {
      console.warn('No steps & no stepper to make getData')
      return () => ({ done: true })
    }
  }

  startTransition = (props: Props<T>) => {
    const { useDeltaTime, useTicks, loop, onFinish, onLoop } = props

    const getData = this.makeGetData(props)
    this.elapsed = 0
    this.setState({
      data: getData(0).data,
    })

    this.tickerCallback = () => {
      if (useDeltaTime) {
        this.elapsed += this.ticker.deltaTime
      } else if (useTicks) {
        this.elapsed++
      } else {
        this.elapsed += this.ticker.elapsedMS
      }

      const { data, done } = getData(this.elapsed)

      if (data !== undefined) {
        if (done) {
          if (loop) {
            if (typeof onLoop === 'function') {
              onLoop(this.elapsed)
            }
            this.elapsed = 0
            this.setState({ data })
          } else {
            this.ticker.stop()
            if (typeof onFinish === 'function') {
              onFinish(this.elapsed)
            }
            return
          }
        } else {
          this.setState({ data })
        }
      }
    }
    this.ticker.add(this.tickerCallback)
    this.ticker.start()
  }

  componentDidMount() {
    this.ticker = new ticker.Ticker()
    if (this.canTransition(this.props)) {
      this.startTransition(this.props)
    }
  }

  componentWillUnmount() {
    this.ticker.destroy()
  }

  render() {
    const { render } = this.props
    const { data } = this.state

    if (data === undefined || data === null) {
      return null
    }

    return render(data, this.elapsed)
  }
}
