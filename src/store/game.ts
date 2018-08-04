import { ActionCreator, data, ActionsUnion } from 'utils/redux'
import { Point } from 'pixi.js'
import { getNextPosition } from './gameTransforms/move'
import { assertNever } from 'utils/other'
import { pointsEqual } from 'utils/pixi'
import { canMove } from 'components/Game'
import { Extend } from 'utils/types'

const initialState = {
  player: {
    position: new Point(10, 12),
  },
  controls: {},
}

export type GameState = Extend<
  typeof initialState,
  {
    player: {
      destination?: Point
      direction?: Direction
    }
    controls: {
      move?: Direction
    }
  }
>

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
            direction: action.data,
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
      let newDirection = undefined
      if (controls.move !== undefined && canMove(player.destination, controls.move)) {
        newDestination = getNextPosition(controls.move, player.destination)
        newDirection = controls.move
      }
      return {
        ...state,
        player: {
          position: player.destination,
          destination: newDestination,
          direction: newDirection,
        },
      }
    }
    default: {
      return assertNever(action, { state })
    }
  }
}
