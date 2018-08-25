import { Point } from 'utils/point'
import { ActionCreator, data, ActionsUnion } from 'utils/redux'
import { movePlayerStart, movePlayerEnd } from 'store/gameTransforms/move'
import { loadMap, LoadedMap } from 'store/gameTransforms/loadMap'
import { assertNever } from 'utils/other'
import { MapsData } from 'assets/maps'
import { TilesetsData } from 'assets/tilesets'

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
        currentMap: loadMap(state, action.data),
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
      return {
        ...state,
        player: {
          ...player,
          ...movePlayerStart(player.position, action.data),
        },
      }
    }
    case 'MoveEnd': {
      const { player } = state

      return {
        ...state,
        player: {
          ...player,
          ...movePlayerEnd(state),
        },
      }
    }
    default: {
      return assertNever(action, { state })
    }
  }
}
