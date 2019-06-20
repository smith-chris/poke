import { TilesetsData } from 'assets/tilesets'
import { MapsData } from 'assets/maps'
import { Point } from 'utils/point'
import {
  LoadMapData,
  loadMap as loadMapUtil,
  LoadedMap,
} from './gameTransforms/loadMap'
import {
  movePlayerStart,
  movePlayerContinue,
  movePlayerEnd,
} from './gameTransforms/move'

enum Direction {
  N = 'north',
  E = 'east',
  W = 'west',
  S = 'south',
}

type MapRenderingData = {
  maps: MapsData
  tilesets: TilesetsData
}

export type CurrentMaps = Partial<Record<'center' | Direction, LoadedMap>>

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
  currentMap: CurrentMaps
} & MapRenderingData

export const initialise = (state: GameState) => (data: MapRenderingData): GameState => {
  return { ...state, ...data }
}

export const loadMap = (state: GameState) => (data: LoadMapData): GameState => {
  return { ...state, ...loadMapUtil(state, data) }
}

export const moveKeyPress = (state: GameState) => (direction: Direction): GameState => {
  return {
    ...state,
    controls: {
      ...state.controls,
      move: direction,
    },
    player: {
      ...state.player,
      moved: true,
    },
  }
}

export const moveKeyRelease = (state: GameState) => (): GameState => {
  return {
    ...state,
    controls: {
      ...state.controls,
      move: undefined,
    },
  }
}

export const moveStart = (state: GameState) => (direction: Direction): GameState => {
  const { player } = state

  return {
    ...state,
    player: {
      ...player,
      ...movePlayerStart(player.position, direction),
    },
  }
}

export const moveContinue = (state: GameState) => (): GameState => {
  const { player } = state

  return {
    ...state,
    player: {
      ...player,
      ...movePlayerContinue(state),
    },
  }
}
export const moveEnd = (state: GameState) => (): GameState => {
  return {
    ...state,
    player: movePlayerEnd(state),
  }
}
