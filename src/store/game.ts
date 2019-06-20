import { Point } from 'utils/point'
import { ActionCreator, data, ActionsUnion } from 'utils/redux'
import {
  movePlayerStart,
  movePlayerEnd,
  movePlayerContinue,
  getNextPosition,
} from 'store/gameTransforms/move'
import { loadMap, LoadedMap, LoadMapData } from 'store/gameTransforms/loadMap'
import { assertNever } from 'utils/other'
import { MapsData } from 'assets/maps'
import { TilesetsData } from 'assets/tilesets'
import { canMove } from './gameUtils'

type MapRenderingData = {
  maps: MapsData
  tilesets: TilesetsData
}

export type CurrentMap = Partial<Record<'center' | Direction, LoadedMap>>

export type GameState = {
  player: {
    destination?: Point
    direction?: Direction
    position: Point
    moved: boolean
  }
  controls: {
    move?: Direction
  }
  currentMap: CurrentMap
} & MapRenderingData

const initialState: GameState = {
  player: {
    position: new Point(12, 12),
    moved: false,
  },
  controls: {},
  maps: {},
  tilesets: {},
  currentMap: {},
}

export enum Direction {
  N = 'north',
  E = 'east',
  W = 'west',
  S = 'south',
}

export const toDirection = (input: string) => {
  // tslint:disable-next-line
  const firstLetter: any = typeof input === 'string' && input[0].toUpperCase()
  if (firstLetter) {
    return Direction[firstLetter] as Direction
  } else {
    console.warn('Couldnt find direction for ', input)
    return undefined
  }
}

export const gameActions = {
  moveKeyPress: ActionCreator('MoveKeyPress', data as Direction),
  moveKeyRelease: ActionCreator('MoveKeyRelease'),
  moveStart: ActionCreator('MoveStart', data as Direction),
  moveContinue: ActionCreator('MoveContinue'),
  moveEnd: ActionCreator('MoveEnd'),
  initialise: ActionCreator('Initialise', data as MapRenderingData),
  loadMap: ActionCreator('LoadMap', data as LoadMapData),
}

type MoveActions = Pick<
  typeof gameActions,
  'moveStart' | 'moveContinue' | 'moveEnd' | 'loadMap'
>

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
        ...loadMap(state, action.data),
      }
    }
    case 'MoveKeyPress': {
      return {
        ...state,
        controls: {
          ...state.controls,
          move: action.data,
        },
        player: {
          ...state.player,
          moved: true,
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
    case 'MoveContinue': {
      const { player } = state
      return {
        ...state,
        player: {
          ...player,
          ...movePlayerContinue(state),
        },
      }
    }
    case 'MoveEnd': {
      return {
        ...state,
        player: movePlayerEnd(state),
      }
    }
    default: {
      return assertNever(action, { state })
    }
  }
}
