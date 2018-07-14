import React, { Component, ReactNode } from 'react'
import { Point, ticker } from 'pixi.js'
import { roundPoint, pointsEqual } from 'utils/pixi'

type Props = {
  render: (position: Point) => ReactNode
  from: Point
  to: Point
  speed?: number
  onFinish?: () => void
}

type State = {
  current: Point
}

export class Transition extends Component<Props, State> {
  ticker: ticker.Ticker
  tickerCallback: () => void

  state = {
    current: new Point(0, 0),
  }

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
    const { from, to, speed = 1, onFinish } = props
    let current = new Point(from.x, from.y)
    if (current) {
      this.setState({ current })
    }

    let stepX = 0
    if (from.x !== to.x) {
      stepX = from.x < to.x ? speed : -speed
    }
    let stepY = 0
    if (from.y !== to.y) {
      stepY = from.y < to.y ? speed : -speed
    }

    this.tickerCallback = () => {
      if (current === undefined || current === null) {
        console.warn('Current is undefined, stopping...')
        this.ticker.stop()
        return
      }
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
      })
      if (stepY === 0 && stepX === 0) {
        this.ticker.stop()
        if (typeof onFinish === 'function') {
          onFinish()
        }
        return
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
