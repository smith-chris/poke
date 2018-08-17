import _palletTown from 'maps/pallettown.blk'
import _palletTownConfig from 'data/mapHeaders/pallettown.asm'
import _route1 from 'maps/route1.blk'
import _route1Config from 'data/mapHeaders/route1.asm'
import { MAP_CONSTANTS } from 'const/map'
import { DEFAULT_TILESET_NAME } from './tilesets'
import { ObjectOf } from 'utils/types'

const tilesetNameRegex = /_h:[\s]*db[\ ]*([A-Z_]*)/

const getTilesetName = (input: string) => {
  const searchResult = tilesetNameRegex.exec(input)
  if (searchResult && searchResult.length >= 1) {
    return searchResult[1]
  }
  console.warn('Couldnt find tile name in: ', input, searchResult)
  return DEFAULT_TILESET_NAME
}

export const mapsData = {
  palletTown: {
    blocksData: _palletTown,
    size: MAP_CONSTANTS.PALLET_TOWN,
    tilesetName: getTilesetName(_palletTownConfig).toLowerCase(),
  },
}
export type MapsData = ObjectOf<typeof mapsData.palletTown>
