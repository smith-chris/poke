import { ActionCreator, data, ActionsUnion } from 'utils/redux'
import { Point } from 'pixi.js'
import { assertNever } from 'utils/other'
import { pointsEqual } from 'utils/pixi'
import { Extend } from 'utils/types'

const initialState = {
  count: 0,
}

export type GameState = typeof initialState

export const gameActions = {
  increment: ActionCreator('moveStart'),
  decrement: ActionCreator('moveEnd'),
}

export type GameAction = ActionsUnion<typeof gameActions>

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'moveStart': {
      return {
        count: state.count + 1,
      }
    }
    case 'moveEnd': {
      return {
        count: state.count - 1,
      }
    }
    default: {
      return assertNever(action, { state })
    }
  }
}
