import { Component, ReactNode } from 'react'
import { ticker } from 'pixi.js'

export type Frames<T> = Array<[number, T]>

type Props<T> = {
  render: (data: T, ms: number) => ReactNode
  frames: Frames<T>
  loop?: boolean
  onFinish?: (ms: number) => void
  onLoop?: (ms: number) => void
}

type State<T> = { data?: T }

export class Transition2<T> extends Component<Props<T>, State<T>> {
  ticker: ticker.Ticker
  tickerCallback: () => void

  state: State<T> = {}

  elapsedTime = 0

  propsDiffer = (newProps: Props<T>) => {
    const { frames } = this.props
    return frames !== newProps.frames
  }

  canTransition(props: Props<T>) {
    const { frames } = props
    return frames && frames.length > 0 && frames[0].length > 1
  }

  shouldComponentUpdate(newProps: Props<T>, newState: State<T>) {
    return this.propsDiffer(newProps) || this.state !== newState
  }

  componentWillReceiveProps(newProps: Props<T>) {
    if (this.canTransition(newProps) && this.propsDiffer(newProps)) {
      this.ticker.remove(this.tickerCallback)
      this.startTransition(newProps)
    }
  }

  startTransition = (props: Props<T>) => {
    const { frames, loop, onFinish, onLoop } = props

    let currentFrameIndex = 0
    let [threshold, data] = frames[currentFrameIndex]
    this.setState({
      data,
    })

    this.tickerCallback = () => {
      this.elapsedTime += this.ticker.elapsedMS

      if (this.elapsedTime > threshold) {
        currentFrameIndex++
        if (currentFrameIndex > frames.length - 1) {
          if (loop) {
            if (typeof onLoop === 'function') {
              onLoop(this.elapsedTime)
            }
            this.elapsedTime = 0
            currentFrameIndex = 0
            threshold = frames[0][0]
            data = frames[0][1]
            this.setState({ data })
          } else {
            this.ticker.stop()
            if (typeof onFinish === 'function') {
              onFinish(this.elapsedTime)
            }
            return
          }
        } else {
          threshold += frames[currentFrameIndex][0]
          this.setState({
            data: frames[currentFrameIndex][1],
          })
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

    return render(data, this.elapsedTime)
  }
}
