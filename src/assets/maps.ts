import { MAP_CONSTANTS } from 'const/map'
import { OVERWORLD } from './tilesets'
import { ObjectOf } from 'utils/types'
import palletTownBlocks from 'maps/pallettown.blk'
import palletTownHeader from 'data/mapHeaders/pallettown.asm'
import palletTownObjects from 'data/mapObjects/pallettown.asm'
import redsHouse1fBlocks from 'maps/redshouse1f.blk'
import redsHouse1fHeader from 'data/mapHeaders/redshouse1f.asm'
import redsHouse1fObjects from 'data/mapObjects/redshouse1f.asm'
import redsHouse2fBlocks from 'maps/redshouse2f.blk'
import redsHouse2fHeader from 'data/mapHeaders/redshouse2f.asm'
import redsHouse2fObjects from 'data/mapObjects/redshouse2f.asm'
import oakslabBlocks from 'maps/oakslab.blk'
import oakslabHeader from 'data/mapHeaders/oakslab.asm'
import oakslabObjects from 'data/mapObjects/oakslab.asm'
import bluesHouseBlocks from 'maps/blueshouse.blk'
import bluesHouseHeader from 'data/mapHeaders/blueshouse.asm'
import bluesHouseObjects from 'data/mapObjects/blueshouse.asm'

const objectRegex = /\n\s([a-z_]+)([a-zA-Z_0-9- ,]*)/g

const tilesetNameRegex = /_h:[\s]*db[\ ]*([A-Z_0-9]*)/

const getTilesetName = (input: string) => {
  const searchResult = tilesetNameRegex.exec(input)
  if (searchResult && searchResult.length >= 1) {
    return searchResult[1]
  }
  console.warn('Couldnt find tile name in: ', input, searchResult)
  return OVERWORLD
}

const parseParams = (params: string) => params.split(',').map(s => s.trim())

const getObjects = (input: string) => {
  let match
  const warps: ObjectOf<{ location: number; mapName: string; id: number }> = {}
  let warpId = 0
  while ((match = objectRegex.exec(input))) {
    // match is now the next match, in array form.
    const [, name, params] = match
    // For now lets just read wraps
    if (name === 'warp') {
      const [x, y, location, mapName] = parseParams(params)
      warps[`${x}_${y}`] = { location: Number(location), mapName, id: warpId }
      warpId++
    }
  }
  return { warps }
}

export const mapsData = {
  PALLET_TOWN: {
    blocksData: palletTownBlocks,
    size: MAP_CONSTANTS.PALLET_TOWN,
    tilesetName: getTilesetName(palletTownHeader),
    objects: getObjects(palletTownObjects),
  },
  REDS_HOUSE_1F: {
    blocksData: redsHouse1fBlocks,
    size: MAP_CONSTANTS.REDS_HOUSE_1F,
    tilesetName: getTilesetName(redsHouse1fHeader),
    objects: getObjects(redsHouse1fObjects),
  },
  REDS_HOUSE_2F: {
    blocksData: redsHouse2fBlocks,
    size: MAP_CONSTANTS.REDS_HOUSE_2F,
    tilesetName: getTilesetName(redsHouse2fHeader),
    objects: getObjects(redsHouse2fObjects),
  },
  OAKS_LAB: {
    blocksData: oakslabBlocks,
    size: MAP_CONSTANTS.OAKS_LAB,
    tilesetName: getTilesetName(oakslabHeader),
    objects: getObjects(oakslabObjects),
  },
  BLUES_HOUSE: {
    blocksData: bluesHouseBlocks,
    size: MAP_CONSTANTS.BLUES_HOUSE,
    tilesetName: getTilesetName(bluesHouseHeader),
    objects: getObjects(bluesHouseObjects),
  },
}

export type MapData = typeof mapsData.PALLET_TOWN

export type MapsData = ObjectOf<MapData>
