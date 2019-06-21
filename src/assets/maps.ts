import maps from 'constants/map_constants.asm'

export type MapData = {
  tilesetName: string
  connections: Record<
    string,
    {
      mapName: string
      offset: number
    }
  >
  blocksData: string
  size: {
    width: number
    height: number
  }
  objects: {
    warps: Record<
      string,
      {
        location: number
        mapName: string
        id: number
      }
    >
  }
}

export type MapsData = Record<string, MapData>

// tslint:disable-next-line
export const mapsData: MapsData = maps as any
