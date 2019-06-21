// tslint:disable no-shadowed-variable
import { isTest } from './env'

export const data = {}

// TODO: make this less complicated!
export const createActionObject = <T extends string, D>(type: T, data?: D) => {
  if (!isTest) {
    console.warn('ACTION', type)
  }
  if (data !== undefined) {
    return { type, data }
  } else {
    return { type }
  }
}

type ActionCreatorType = {
  <T extends string>(type: T): () => { type: T }
  <T extends string, D>(type: T, data: D): (data: D) => { type: T; data: D }
}
export const ActionCreator: ActionCreatorType = <T extends string, D>(
  type: T,
  data?: D,
) => {
  if (data) {
    return createActionObject.bind(null, type)
  } else {
    return createActionObject.bind(null, type, null)
  }
}

type ActionType = {
  <T extends string>(type: T): { type: T }
  <T extends string, D>(type: T, data: D): { type: T; data: D }
}
export const Action = createActionObject as ActionType

export type ValueOf<T> = T[keyof T]

type Flatten<T> = T extends Array<infer U> ? U : T

// tslint:disable-next-line
type ReturnTypeIfPossible<T> = T extends (...args: any[]) => any ? ReturnType<T> : T

type CurriedReturnType<T> = ReturnTypeIfPossible<ReturnTypeIfPossible<T>>

export type ActionsUnion<
  T extends Record<string, (d?: {}, s?: StoreState) => {}>
> = Exclude<NonNullable<Flatten<CurriedReturnType<ValueOf<T>>>>, boolean>

export const transformActions = (({ dispatch, getState }) => {
  return next => _action => {
    let action = _action
    if (typeof action === 'function') {
      action = (action as Function)(getState())
    }
    if (Array.isArray(action)) {
      action.filter(Boolean).map(dispatch)
    } else {
      next(action)
    }
  }
}) as Redux.Middleware
