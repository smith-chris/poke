import { ActionCreator, data, ActionsUnion, Action } from 'utils/redux'

export type UIState = {
  round: number
}

const initialState: UIState = { round: 0 }

export const uiActions = {
  increment: ActionCreator('increment'),
  decrement: ActionCreator('decrement'),
}

export type UIAction = ActionsUnion<typeof uiActions>

export const uiReducer = (state: UIState = initialState, action: UIAction): UIState => {
  switch (action.type) {
    case 'increment':
      return { round: state.round + 1 }
    case 'decrement':
      return { round: state.round - 1 }
    default: {
      const exhaustiveCheck: never = action
      return state
    }
  }
}
