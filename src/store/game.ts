import { ActionCreator, data, ActionsUnion, Action } from 'utils/redux'
import { Point } from 'pixi.js'
import { getNextPosition } from './gameTransforms/move'
import { assertNever } from 'utils/other'
import { pointsEqual } from 'utils/pixi'
import { canMove } from 'components/Game'

export type GameState = {
  controls: {
    move?: Direction
  }
  player: {
    position: Point
    destination?: Point
  }
}

const initialState: GameState = {
  player: { position: new Point(12, 12) },
  controls: {},
}

export enum Direction {
  N = 'N',
  E = 'E',
  W = 'W',
  S = 'S',
}

export const gameActions = {
  moveStart: ActionCreator('moveStart', data as Direction),
  moveEnd: ActionCreator('moveEnd'),
  moveKeyPress: ActionCreator('moveKeyPress', data as Direction),
  moveKeyRelease: ActionCreator('moveKeyRelease'),
}

export type GameAction = ActionsUnion<typeof gameActions>

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'moveKeyPress': {
      return {
        ...state,
        controls: {
          ...state.controls,
          move: action.data,
        },
      }
    }
    case 'moveKeyRelease': {
      return {
        ...state,
        controls: {
          ...state.controls,
          move: undefined,
        },
      }
    }
    case 'moveStart': {
      const { player } = state
      const destination = getNextPosition(action.data, player.position)
      if (!pointsEqual(destination, player.position)) {
        return {
          ...state,
          player: {
            ...player,
            destination,
          },
        }
      } else {
        return state
      }
    }
    case 'moveEnd': {
      const { player, controls } = state
      if (!player.destination) {
        return state
      }
      let newDestination = undefined
      if (controls.move !== undefined && canMove(player.destination, controls.move)) {
        newDestination = getNextPosition(controls.move, player.destination)
      }
      return {
        ...state,
        player: {
          position: player.destination,
          destination: newDestination,
        },
      }
    }
    default: {
      return assertNever(action, { state })
    }
  }
}
