// tslint:disable no-any

/**
 * Let's look at it in plain english:
 *
 * Action is an object: {type: string, data?: any}
 * ActionCreator creates Action with constant type: (data: any) => {type: 'A', data: data}
 * ActionResolver is a function that takes State, Action.data and returns State
 */
export type Action<T = any> = { type: string; data?: T[] }

export type ActionCreator<T = any> = (data?: T) => Action<T>

export type ActionResolver<TState = any> = (state: TState) => (...data: any[]) => TState
export type ActionResolvers<TState = any> = Record<string, ActionResolver<TState>>

type GetActionCreator<
  TActionResolver extends ActionResolver,
  TType extends PropertyKey,
  // f of 0-2 arguments that returns shard of the store. We need it to return {type, data} object
  T = ReturnType<TActionResolver>
> = T extends () => any
  ? () => { type: TType }
  : T extends (...arg: infer U) => any
  ? (...arg: U) => { type: TType; data: U }
  : () => { type: TType }

type GetActionCreators<TActionResolvers extends ActionResolvers> = {
  [K in keyof TActionResolvers]: GetActionCreator<TActionResolvers[K], K>
}

export const makeActionCreators = <T extends ActionResolvers<TState>, TState = any>(
  actions: T,
  _?: TState,
) =>
  Object.keys(actions).reduce((acc: Record<string, ActionCreator>, type) => {
    // tslint:disable-next-line
    acc[type] = (...data: any[]) => {
      if (data.length === 0) {
        return { type }
      } else {
        return { type, data }
      }
    }
    return acc
  }, {}) as GetActionCreators<T>

export const makeReducer = <TState = any>(
  actionResolvers: ActionResolvers,
  initialState: TState,
) => (state = initialState, action: Action): TState => {
  const actionResolver = actionResolvers[action.type]

  if (typeof actionResolver === 'function') {
    if (action.data) {
      return actionResolver(state)(...action.data)
    } else {
      return actionResolver(state)()
    }
  }

  return state
}

export let actionsPaused = { value: false }

export const pauseActions = () => {
  if (!actionsPaused.value) {
    console.info('Redux actions paused')
    actionsPaused.value = true
  }
}
export const resumeActions = () => {
  if (actionsPaused.value) {
    console.info('Redux actions resumed')
    actionsPaused.value = false
  }
}

export const transformActions = (() => {
  return next => (action: Action) => {
    if (!actionsPaused.value) {
      console.warn(`ACTION - ${action.type} (`, ...(action.data || []), ')')
      next(action)
    }
  }
}) as Redux.Middleware
