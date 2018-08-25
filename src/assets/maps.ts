import palletTownBlocks from 'maps/pallettown.blk'
import palletTownHeader from 'data/mapHeaders/pallettown.asm'
import palletTownObjects from 'data/mapObjects/pallettown.asm'
import { MAP_CONSTANTS } from 'const/map'
import { DEFAULT_TILESET_NAME } from './tilesets'
import { ObjectOf } from 'utils/types'

const objectRegex = /\n\s([a-z_]+)([a-zA-Z_0-9 ,]*)/g

const tilesetNameRegex = /_h:[\s]*db[\ ]*([A-Z_]*)/

const getTilesetName = (input: string) => {
  const searchResult = tilesetNameRegex.exec(input)
  if (searchResult && searchResult.length >= 1) {
    return searchResult[1].toLowerCase()
  }
  console.warn('Couldnt find tile name in: ', input, searchResult)
  return DEFAULT_TILESET_NAME.toLowerCase()
}

const getObjects = (input: string) => {
  let match
  const warps = []
  while ((match = objectRegex.exec(input))) {
    // match is now the next match, in array form.
    const [_, name, params] = match
    // For now lets just read wraps
    if (name === 'warp') {
      warps.push(params.split(',').map(s => s.trim()))
    }
  }
  return { warps }
}

export const mapsData = {
  palletTown: {
    blocksData: palletTownBlocks,
    size: MAP_CONSTANTS.PALLET_TOWN,
    tilesetName: getTilesetName(palletTownHeader),
    objects: getObjects(palletTownObjects),
  },
}
export type MapsData = ObjectOf<typeof mapsData.palletTown>
