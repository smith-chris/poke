import React, { Component, ReactNode } from 'react'
import { Point, ticker } from 'pixi.js'
import { roundPoint, pointsEqual } from 'utils/pixi'

type Props = {
  render: (position: number) => ReactNode
  from: number
  to: number
  speed?: number
  onFinish?: () => void
}

type State = {
  current: number
}

export class Transition extends Component<Props, State> {
  ticker: ticker.Ticker

  state = {
    current: 0,
  }

  componentWillMount() {
    this.ticker = new ticker.Ticker()
    const { from, to, speed = 1, onFinish } = this.props
    let current = from
    if (current) {
      this.setState({ current })
    }

    const step = from < to ? speed : -speed

    this.ticker.add(() => {
      if (current === undefined || current === null) {
        console.warn('Current is undefined, stopping...')
        this.ticker.stop()
        return
      }
      current += step
      this.setState({
        current: Math.round(current),
      })
      if (Math.abs(to - current) < Math.abs(step)) {
        this.ticker.stop()
        if (typeof onFinish === 'function') {
          onFinish()
        }
        return
      }
    })
    this.ticker.start()
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
