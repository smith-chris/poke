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
    moved: boolean
  }
  controls: {
    move?: Direction
  }
  currentMap: Partial<Record<'center' | Direction, LoadedMap>>
} & MapRenderingData

const initialState: GameState = {
  player: {
    position: new Point(20, 18), // 'CERULEAN_CITY'
    // position: new Point(9, 10), // 'PALLET_TOWN'
    // position: new Point(0, 12),
    // position: new Point(89, 12), // ROUTE_4
    // position: new Point(10, 10),
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
  const firstLetter: any = typeof input === 'string' && input[0]
  if (firstLetter) {
    return Direction[firstLetter]
  } else {
    console.warn('Couldnt find direction for ', input)
    return Direction.N
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

export const wannaMove = (
  { player, currentMap, controls, maps }: GameState,
  actions: MoveActions,
  direction?: Direction,
) => {
  const moveDirection = direction || controls.move
  const from = player.destination || player.position
  if (!moveDirection) {
    console.warn('No move direction!', { controls, direction })
    return
  }
  if (!currentMap.center) {
    console.warn('No current map!', currentMap)
    return
  }
  const playerCanMove = canMove(from, moveDirection, currentMap.center.collisions)
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
    const { objects, connections, size } = maps[currentMap.center.name]
    const warp = objects.warps[`${x}_${y}`]

    if (warp) {
      const { mapName, location } = warp
      if (mapName === '-1') {
        actions.loadMap({ mapName: 'PALLET_TOWN', location, exit: true })
        return false
      }
    }

    const to = getNextPosition(from, moveDirection)
    const { north, east, west, south } = connections
    const northMap = maps[north.mapName]
    const westMap = maps[west.mapName]
    const southMap = maps[south.mapName]

    if (to.y < 0) {
      if (north && northMap) {
        const position = new Point(north.x * 4 + from.x, northMap.size.height * 2)
        const destination = new Point(position.x, position.y - 1)

        actions.loadMap({
          mapName: north.mapName,
          playerData: { position, destination, direction: Direction.N },
        })
      }
      return true
    } else if (to.y >= size.height) {
      if (south && southMap) {
        const position = new Point(south.x * 4 + from.x, -1)
        const destination = new Point(position.x, 0)

        actions.loadMap({
          mapName: south.mapName,
          playerData: { position, destination, direction: Direction.S },
        })
      }
      return true
    } else if (to.x < 0) {
      if (west && westMap) {
        const position = new Point(westMap.size.width * 2, from.y)
        const destination = new Point(position.x - 1, position.y)

        actions.loadMap({
          mapName: west.mapName,
          playerData: { position, destination, direction: Direction.W },
        })
      }
      return true
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
