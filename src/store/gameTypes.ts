import { TilesetsData } from 'assets/tilesets'
import { MapsData } from 'assets/maps'
import { Point } from 'utils/point'

export type LoadedMap = {
  name: string
  textureIds: number[][]
  collisions: boolean[][]
}

export type LoadMapData = {
  mapName: string
  location?: number
  playerData?: { position: Point; destination: Point; direction: Direction }
  exit?: boolean
}

export enum Direction {
  N = 'north',
  E = 'east',
  W = 'west',
  S = 'south',
}

export type MapRenderingData = {
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
