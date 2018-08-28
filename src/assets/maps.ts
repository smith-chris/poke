import { MAP_CONSTANTS } from 'const/map'
import { OVERWORLD } from './tilesets'
import { ObjectOf } from 'utils/types'
import { toDirection } from 'store/game'
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
import route1Blocks from 'maps/route1.blk'
import route1Header from 'data/mapHeaders/route1.asm'
import route1Objects from 'data/mapObjects/route1.asm'
import route4Blocks from 'maps/route4.blk'
import route4Header from 'data/mapHeaders/route4.asm'
import route4Objects from 'data/mapObjects/route4.asm'
import route5Blocks from 'maps/route5.blk'
import route5Header from 'data/mapHeaders/route5.asm'
import route5Objects from 'data/mapObjects/route5.asm'
import route9Blocks from 'maps/route9.blk'
import route9Header from 'data/mapHeaders/route9.asm'
import route9Objects from 'data/mapObjects/route9.asm'
import route21Blocks from 'maps/route21.blk'
import route21Header from 'data/mapHeaders/route21.asm'
import route21Objects from 'data/mapObjects/route21.asm'
import route24Blocks from 'maps/route24.blk'
import route24Header from 'data/mapHeaders/route24.asm'
import route24Objects from 'data/mapObjects/route24.asm'
import ceruleanCityBlocks from 'maps/ceruleancity.blk'
import ceruleanCityHeader from 'data/mapHeaders/ceruleancity.asm'
import ceruleanCityObjects from 'data/mapObjects/ceruleancity.asm'

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
  return { tilesetName, connections }
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
  ROUTE_1: {
    blocksData: route1Blocks,
    size: MAP_CONSTANTS.ROUTE_1,
    objects: getObjects(route1Objects),
    ...getHeaders(route1Header),
  },
  ROUTE_4: {
    blocksData: route4Blocks,
    size: MAP_CONSTANTS.ROUTE_4,
    objects: getObjects(route4Objects),
    ...getHeaders(route4Header),
  },
  ROUTE_5: {
    blocksData: route5Blocks,
    size: MAP_CONSTANTS.ROUTE_5,
    objects: getObjects(route5Objects),
    ...getHeaders(route5Header),
  },
  ROUTE_9: {
    blocksData: route9Blocks,
    size: MAP_CONSTANTS.ROUTE_9,
    objects: getObjects(route9Objects),
    ...getHeaders(route9Header),
  },
  ROUTE_21: {
    blocksData: route21Blocks,
    size: MAP_CONSTANTS.ROUTE_21,
    objects: getObjects(route21Objects),
    ...getHeaders(route21Header),
  },
  ROUTE_24: {
    blocksData: route24Blocks,
    size: MAP_CONSTANTS.ROUTE_24,
    objects: getObjects(route24Objects),
    ...getHeaders(route24Header),
  },
  CERULEAN_CITY: {
    blocksData: ceruleanCityBlocks,
    size: MAP_CONSTANTS.CERULEAN_CITY,
    objects: getObjects(ceruleanCityObjects),
    ...getHeaders(ceruleanCityHeader),
  },
}

export type MapData = typeof mapsData.PALLET_TOWN

export type MapsData = ObjectOf<MapData>
