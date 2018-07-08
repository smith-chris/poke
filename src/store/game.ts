import { ActionCreator, data, ActionsUnion, Action } from 'utils/redux'
import { Point } from 'pixi.js'
import { move } from './gameTransforms/move'
import { assertNever } from 'utils/other'

export type GameState = {
  player: {
    position: Point
  }
}

const initialState: GameState = { player: { position: new Point() } }

export enum Direction {
  N,
  E,
  W,
  S,
}

export const gameActions = {
  move: ActionCreator('move', data as Direction),
  test: ActionCreator('test'),
}

export type GameAction = ActionsUnion<typeof gameActions>

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'move':
      return {
        ...state,
        player: {
          position: move(action.data, state.player.position),
        },
      }
    case 'test':
      return state
    default: {
      return assertNever(action, { state })
    }
  }
}
