import { ActionCreator, data, ActionsUnion } from 'utils/redux'
import { assertNever } from 'utils/other'

const initialState = {
  count: 0,
}

export type GameState = typeof initialState

export const gameActions = {
  increment: ActionCreator('increment'),
  decrement: ActionCreator('decrement'),
}

export type GameAction = ActionsUnion<typeof gameActions>

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'increment': {
      return {
        count: state.count + 1,
      }
    }
    case 'decrement': {
      return {
        count: state.count - 1,
      }
    }
    default: {
      return assertNever(action, { state })
    }
  }
}
