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
  lastMapName?: string
} & MapRenderingData

const initialState: GameState = {
  player: {
    position: new Point(5, 6),
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
  moveContinue: ActionCreator('MoveContinue'),
  moveEnd: ActionCreator('MoveEnd'),
  initialise: ActionCreator('Initialise', data as MapRenderingData),
  loadMap: ActionCreator('LoadMap', data as LoadMapData),
}

type MoveActions = Pick<
  typeof gameActions,
  'moveStart' | 'moveContinue' | 'moveEnd' | 'loadMap'
>

export const wannaMove = (
  { player, currentMap, controls, maps, lastMapName }: GameState,
  actions: MoveActions,
  direction?: Direction,
) => {
  const moveDirection = direction || controls.move
  const from = player.destination || player.position
  if (!moveDirection) {
    console.warn('No move direction!', { controls, direction })
    return
  }
  if (!currentMap) {
    console.warn('No current map!', currentMap)
    return
  }
  const playerCanMove = canMove(from, moveDirection, currentMap.collisions)
  if (playerCanMove) {
    if (player.destination === undefined) {
      // Check if can move - if not, check for undefined collision
      actions.moveStart(moveDirection)
    } else {
      actions.moveContinue()
    }
    return true
  } else if (playerCanMove === undefined) {
    const { x, y } = from
    const { objects } = maps[currentMap.name]
    const warp = objects.warps[`${x}_${y}`]

    if (warp) {
      const { mapName, location } = warp
      if (mapName === '-1') {
        if (!lastMapName) {
          console.warn('Last map name is not available', { mapName, lastMapName })
        }
        actions.loadMap({ mapName: lastMapName || 'PALLET_TOWN', location, exit: true })
      }
    }
  }
  return false
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
