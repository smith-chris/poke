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
import { Direction, toDirection } from 'store/game'

const objectRegex = /\n\s([a-z_]+)([a-zA-Z_0-9- ,]*)/g

const tilesetNameRegex = /_h:[\s]*db[\ ]*([A-Z_0-9]*)/
const connectionsRegex = /((NORTH|SOUTH|WEST|EAST)_MAP_CONNECTION)([A-Z _,0-9]*)\s/g

const parseParams = (params: string) =>
  params
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '')

const getHeaders = (input: string) => {
  let match
  let connections: ObjectOf<{ mapName: string; x: number; y: number }> = {}
  while ((match = connectionsRegex.exec(input))) {
    const [, , direction, params] = match
    const [, mapName, x, y] = parseParams(params)
    connections[toDirection(direction)] = { mapName, x: Number(x), y: Number(y) }
  }

  let tilesetName
  const searchResult = tilesetNameRegex.exec(input)
  if (searchResult && searchResult.length >= 1) {
    tilesetName = searchResult[1]
  } else {
    console.warn('Couldnt find tile name in: ', input, searchResult)
    tilesetName = OVERWORLD
  }
  return { tilesetName, connections, huj: 5 }
}

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
    objects: getObjects(palletTownObjects),
    ...getHeaders(palletTownHeader),
  },
  REDS_HOUSE_1F: {
    blocksData: redsHouse1fBlocks,
    size: MAP_CONSTANTS.REDS_HOUSE_1F,
    objects: getObjects(redsHouse1fObjects),
    ...getHeaders(redsHouse1fHeader),
  },
  REDS_HOUSE_2F: {
    blocksData: redsHouse2fBlocks,
    size: MAP_CONSTANTS.REDS_HOUSE_2F,
    objects: getObjects(redsHouse2fObjects),
    ...getHeaders(redsHouse2fHeader),
  },
  OAKS_LAB: {
    blocksData: oakslabBlocks,
    size: MAP_CONSTANTS.OAKS_LAB,
    objects: getObjects(oakslabObjects),
    ...getHeaders(oakslabHeader),
  },
  BLUES_HOUSE: {
    blocksData: bluesHouseBlocks,
    size: MAP_CONSTANTS.BLUES_HOUSE,
    objects: getObjects(bluesHouseObjects),
    ...getHeaders(bluesHouseHeader),
  },
}

export type MapData = typeof mapsData.PALLET_TOWN

export type MapsData = ObjectOf<MapData>
