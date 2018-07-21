import React, { Component, ReactNode } from 'react'
import { Point, ticker } from 'pixi.js'
import { roundPoint, pointsEqual } from 'utils/pixi'

type Props = {
  render: (position: Point) => ReactNode
  from: Point
  to: Point
  speed?: number
  loop?: boolean
  onFinish?: (ticks: number) => void
  onLoop?: (ticks: number) => void
}

type State = {
  current: Point
}

const defaultState = {
  current: new Point(0, 0),
  ticks: 0,
}

export class Transition extends Component<Props, typeof defaultState> {
  ticker: ticker.Ticker
  tickerCallback: () => void

  state = defaultState

  componentWillReceiveProps(newProps: Props) {
    if (
      this.canTransition(newProps) &&
      (!pointsEqual(newProps.from, this.props.from) ||
        !pointsEqual(newProps.to, this.props.to))
    ) {
      this.ticker.remove(this.tickerCallback)
      this.startTransition(newProps)
    }
  }

  startTransition = (props: Props) => {
    const { from, to, speed = 1, loop, onFinish, onLoop } = props
    let current = new Point(0)
    let stepX = 0
    let stepY = 0
    const init = () => {
      current = new Point(from.x, from.y)
      if (from.x !== to.x) {
        stepX = from.x < to.x ? speed : -speed
      }
      if (from.y !== to.y) {
        stepY = from.y < to.y ? speed : -speed
      }
    }
    init()
    this.setState({ current, ticks: 0 })

    this.tickerCallback = () => {
      if (current === undefined || current === null) {
        console.warn('Current is undefined, stopping...')
        this.ticker.stop()
        return
      }
      const { ticks } = this.state
      current.x += stepX
      const xFinished = Math.abs(to.x - current.x) < Math.abs(stepX)
      if (xFinished) {
        stepX = 0
        current.x = to.x
      }
      current.y += stepY
      const yFinished = Math.abs(to.y - current.y) < Math.abs(stepY)
      if (yFinished) {
        stepY = 0
        current.y = to.y
      }
      this.setState({
        current: roundPoint(current),
        ticks: ticks + 1,
      })
      if (stepY === 0 && stepX === 0) {
        if (loop) {
          init()
          if (typeof onLoop === 'function') {
            onLoop(ticks + 1)
          }
        } else {
          this.ticker.stop()
          if (typeof onFinish === 'function') {
            onFinish(ticks + 1)
          }
          return
        }
      }
    }
    this.ticker.add(this.tickerCallback)
    this.ticker.start()
  }

  canTransition(props: Props) {
    const { from, to } = props
    return from !== undefined && to !== undefined && !pointsEqual(from, to)
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
    const { current } = this.state

    return render(current)
  }
}
