import { Stepper } from 'utils/transition'
import React, { Component, ReactType, ComponentType } from 'react'
import { Omit } from './fiber'
import { ticker } from 'pixi.js'

type TransitionOptions<S> = {
  useDeltaTime?: boolean
  useTicks?: boolean
  loop?: boolean
  onLoop?: (inupt: S) => S
}

export type TransitionProps<T> = {
  data: T
  transition: {
    stop: () => void
    start: () => void
    reset: () => void
  }
}

type State<T> = Pick<TransitionProps<T>, 'data'>

const getName = (prefix: string, component: ComponentType) =>
  `${prefix}(${component.displayName || component.name})`

export function withTransition<T, S = {}>(
  stepper: Stepper<T>,
  { useDeltaTime, useTicks, loop, onLoop }: TransitionOptions<S> = {},
  displayName?: string,
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

  const transition = {
    start: () => {
      if (!Ticker.started) {
        stepper.reset()
        Ticker.start()
        const { data } = stepper.next(0)
        listeners.forEach(cb => cb(data))
      }
    },
    reset: () => {
      stepper.reset()
      const { data } = stepper.next(0)
      listeners.forEach(cb => cb(data))
    },
    stop: () => {
      if (Ticker.started) {
        Ticker.stop()
      }
    },
  }

  return <
    AllProps extends TransitionProps<T>,
    Props = Omit<AllProps, keyof TransitionProps<T>>
  >(
    Target: ComponentType<AllProps>,
  ) => {
    if (displayName) {
      Target.displayName = displayName
    }
    return class extends Component<Props, State<T>> {
      static displayName = getName('WithTransition', Target)

      ticker: ticker.Ticker
      tickerCallback: () => void

      state: State<T> = { data: stepper.next(0).data }

      shouldComponentUpdate(newProps: Props, newState: State<T>) {
        return this.state.data !== newState.data || this.props !== newProps
      }

      setData = (data: T) => {
        if (data !== this.state.data) {
          this.setState({ data })
        }
      }

      onLoop = () => {}

      componentDidMount() {
        addListener(this.setData)
      }

      componentWillUnmount() {
        removeListener(this.setData)
      }

      render() {
        return <Target {...this.props} data={this.state.data} transition={transition} />
      }
    }
  }
}
