import { Stepper } from 'utils/transition'
import React, { Component, ReactType } from 'react'
import { Omit } from './fiber'
import { ticker } from 'pixi.js'

type TransitionOptions = {
  useDeltaTime?: boolean
  useTicks?: boolean
  loop?: boolean
}

export type TransitionProps<T> = {
  data: T
}

type State<T> = Partial<TransitionProps<T>>

export function withTransition<T>(
  stepper: Stepper<T>,
  { useDeltaTime, useTicks, loop }: TransitionOptions = {},
) {
  const Ticker = new ticker.Ticker()

  type Listener = (data: T) => void

  const listeners: Listener[] = []

  const addListener = (listener: Listener) => {
    listeners.push(listener)
    if (listeners.length === 1) {
      Ticker.start()
    }
  }

  const removeListener = (listener: Listener) => {
    const i = listeners.indexOf(listener)
    if (i >= 0) {
      listeners.splice(i, 1)
      if (listeners.length === 0) {
        Ticker.stop()
      }
    }
  }

  const tickerCallback = () => {
    let elapsed
    if (useDeltaTime) {
      elapsed = Ticker.deltaTime
    } else if (useTicks) {
      elapsed = 1
    } else {
      elapsed = Ticker.elapsedMS
    }

    const { data, done } = stepper.next(elapsed)

    if (data !== undefined) {
      if (done) {
        if (loop) {
          stepper.reset()
          listeners.forEach(cb => cb(data))
        } else {
          Ticker.stop()
          return
        }
      } else {
        listeners.forEach(cb => cb(data))
      }
    }
  }
  Ticker.add(tickerCallback)

  return <
    AllProps extends TransitionProps<T>,
    Props = Omit<AllProps, keyof TransitionProps<T>>
  >(
    Cmpn: ReactType<AllProps>,
  ) => {
    return class extends Component<Props, State<T>> {
      static displayName = `WithTransition(${'Flower'})`

      ticker: ticker.Ticker
      tickerCallback: () => void

      state: State<T> = {}

      shouldComponentUpdate(_: Props, newState: State<T>) {
        return this.state.data !== newState.data
      }

      setData = (data?: T) => {
        if (data !== this.state.data) {
          this.setState({ data })
        }
      }

      componentDidMount() {
        addListener(this.setData)
      }

      componentWillUnmount() {
        removeListener(this.setData)
      }

      render() {
        return <Cmpn {...this.props} data={stepper.next(0).data} />
      }
    }
  }
}
