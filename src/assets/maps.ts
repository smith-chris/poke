import { ObjectOf } from 'utils/types'
import maps from 'constants/map_constants.asm'

export type MapData = {
  tilesetName: string
  connections: ObjectOf<{
    mapName: string
    offset: number
  }>
  blocksData: string
  size: {
    width: number
    height: number
  }
  objects: {
    warps: ObjectOf<{
      location: number
      mapName: string
      id: number
    }>
  }
}

export type MapsData = ObjectOf<MapData>

// tslint:disable-next-line
export const mapsData: MapsData = maps as any
