import { ActionCreator, data, ActionsUnion } from 'utils/redux'
import { Point } from 'pixi.js'
import { getNextPosition } from './gameTransforms/move'
import { assertNever } from 'utils/other'
import { pointsEqual } from 'utils/pixi'
import { canMove } from 'components/Game'
import { MapsData } from 'assets/maps'
import { TilesetsData } from 'assets/tilesets'
import { loadMapTransform, LoadedMap } from './gameTransforms/loadMap'

type MapRenderingData = {
  maps: MapsData
  tilesets: TilesetsData
}

export type GameState = {
  player: {
    destination?: Point
    direction?: Direction
    position: Point
  }
  controls: {
    move?: Direction
  }
  currentMap?: LoadedMap
} & MapRenderingData

const initialState: GameState = {
  player: {
    position: new Point(12, 12),
  },
  controls: {},
  maps: {},
  tilesets: {},
}

export enum Direction {
  N = 'N',
  E = 'E',
  W = 'W',
  S = 'S',
}

export const gameActions = {
  moveKeyPress: ActionCreator('MoveKeyPress', data as Direction),
  moveKeyRelease: ActionCreator('MoveKeyRelease'),
  moveStart: ActionCreator('MoveStart', data as Direction),
  moveEnd: ActionCreator('MoveEnd'),
  initialise: ActionCreator('Initialise', data as MapRenderingData),
  loadMap: ActionCreator('LoadMap', data as string),
}

export type GameAction = ActionsUnion<typeof gameActions>

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'Initialise': {
      return {
        ...state,
        ...action.data,
      }
    }
    case 'LoadMap': {
      return {
        ...state,
        currentMap: loadMapTransform(state, action.data),
      }
    }
    case 'MoveKeyPress': {
      return {
        ...state,
        controls: {
          ...state.controls,
          move: action.data,
        },
      }
    }
    case 'MoveKeyRelease': {
      return {
        ...state,
        controls: {
          ...state.controls,
          move: undefined,
        },
      }
    }
    case 'MoveStart': {
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
    case 'MoveEnd': {
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
