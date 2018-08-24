import { Stepper } from 'utils/transition'
import React, { Component, ComponentType, ReactNode } from 'react'
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

type WithTransitionState<T> = Pick<TransitionProps<T>, 'data'>

const getName = (prefix: string, component: ComponentType) =>
  `${prefix}(${component.displayName || component.name})`

type Listener<T> = (data: T) => void

export function withTransition<T, S = {}>(
  stepper: Stepper<T>,
  { useDeltaTime, useTicks, loop }: TransitionOptions<S> = {},
  displayName?: string,
) {
  const Ticker = new ticker.Ticker()

  const listeners: Listener<T>[] = []

  const addListener = (listener: Listener<T>) => {
    listeners.push(listener)
    if (listeners.length === 1) {
      Ticker.start()
    }
  }

  const removeListener = (listener: Listener<T>) => {
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
    return class extends Component<Props, WithTransitionState<T>> {
      static displayName = getName('WithTransition', Target)

      ticker: ticker.Ticker
      tickerCallback: () => void

      state: WithTransitionState<T> = { data: stepper.next(0).data }

      shouldComponentUpdate(newProps: Props, newState: WithTransitionState<T>) {
        return this.state.data !== newState.data || this.props !== newProps
      }

      setData = (data: T) => {
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
        return <Target {...this.props} data={this.state.data} transition={transition} />
      }
    }
  }
}

type TranProps<T> = {
  render: (data?: T) => ReactNode
  useDeltaTime?: boolean
  useTicks?: boolean
  loop?: boolean
  onFinish?: () => void
  onLoop?: () => void
  stepper?: Stepper<T>
}

type TranState<T> = { data?: T }

// This is temporary and will be refactored to share functionality with withTransition
export class Transition<T> extends Component<TranProps<T>, TranState<T>> {
  ticker = new ticker.Ticker()
  tickerCallback: () => void

  state: TranState<T> = {}

  propsDiffer = (newProps: TranProps<T>) => {
    const { stepper } = this.props
    return stepper !== newProps.stepper
  }

  canTransition(props: TranProps<T>) {
    const { stepper } = props
    return stepper !== undefined
  }

  componentWillReceiveProps(newProps: TranProps<T>) {
    if (this.props.stepper !== newProps.stepper) {
      this.ticker.remove(this.tickerCallback)
      if (newProps.stepper !== undefined) {
        this.startTransition(newProps)
      } else {
        // We want no data if stepper is undefined
        this.setData(undefined)
      }
    }
  }

  setData = (data?: T) => {
    if (data !== this.state.data) {
      this.setState({ data })
    }
  }

  startTransition = (props: TranProps<T>) => {
    const { useDeltaTime, useTicks, loop, onFinish, onLoop, stepper } = props

    if (!stepper) {
      this.setData(undefined)
      return
    }

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
            stepper.reset()
            this.setData(data)
            if (typeof onLoop === 'function') {
              onLoop()
            }
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
    return render(data)
  }
}
