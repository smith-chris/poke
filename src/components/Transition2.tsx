import { Component, ReactNode } from 'react'
import { ticker } from 'pixi.js'
import { Stepper } from 'utils/transition'

type Props<T> = {
  render: (data: T) => ReactNode
  useDeltaTime?: boolean
  useTicks?: boolean
  loop?: boolean
  onFinish?: () => void
  onLoop?: () => void
  stepper: Stepper<T>
}

type State<T> = { data?: T }

export class Transition2<T> extends Component<Props<T>, State<T>> {
  ticker: ticker.Ticker
  tickerCallback: () => void

  state: State<T> = {}

  propsDiffer = (newProps: Props<T>) => {
    const { stepper } = this.props
    return stepper !== newProps.stepper
  }

  canTransition(props: Props<T>) {
    const { stepper } = props
    return stepper !== undefined
  }

  shouldComponentUpdate(_: Props<T>, newState: State<T>) {
    return this.state.data !== newState.data
  }

  componentWillReceiveProps(newProps: Props<T>) {
    if (this.canTransition(newProps) && this.propsDiffer(newProps)) {
      this.ticker.remove(this.tickerCallback)
      this.startTransition(newProps)
    }
  }

  setData = (data?: T) => {
    if (data !== this.state.data) {
      this.setState({ data })
    }
  }

  startTransition = (props: Props<T>) => {
    const { useDeltaTime, useTicks, loop, onFinish, onLoop, stepper } = props

    this.setData(stepper.next(0).data)

    this.tickerCallback = () => {
      let elapsed
      if (useDeltaTime) {
        elapsed = this.ticker.deltaTime
      } else if (useTicks) {
        elapsed = 1
      } else {
        elapsed = this.ticker.elapsedMS
      }

      const { data, done } = stepper.next(elapsed)

      if (data !== undefined) {
        if (done) {
          if (loop) {
            if (typeof onLoop === 'function') {
              onLoop()
            }
            stepper.reset()
            this.setData(data)
          } else {
            this.ticker.stop()
            if (typeof onFinish === 'function') {
              onFinish()
            }
            return
          }
        } else {
          this.setData(data)
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

    if (data === undefined) {
      return null
    }

    return render(data)
  }
}
