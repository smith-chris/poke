import { MAP_CONSTANTS } from 'const/map'
import { OVERWORLD } from './tilesets'
import { ObjectOf } from 'utils/types'
import { toDirection, Direction } from 'store/game'
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
import viridianCityBlocks from 'maps/viridiancity.blk'
import viridianCityHeader from 'data/mapHeaders/viridiancity.asm'
import viridianCityObjects from 'data/mapObjects/viridiancity.asm'
import pewterCityBlocks from 'maps/pewtercity.blk'
import pewterCityHeader from 'data/mapHeaders/pewtercity.asm'
import pewterCityObjects from 'data/mapObjects/pewtercity.asm'
import saffronCityBlocks from 'maps/saffroncity.blk'
import saffronCityHeader from 'data/mapHeaders/saffroncity.asm'
import saffronCityObjects from 'data/mapObjects/saffroncity.asm'
import route1Blocks from 'maps/route1.blk'
import route1Header from 'data/mapHeaders/route1.asm'
import route1Objects from 'data/mapObjects/route1.asm'
import route2Blocks from 'maps/route2.blk'
import route2Header from 'data/mapHeaders/route2.asm'
import route2Objects from 'data/mapObjects/route2.asm'
import route3Blocks from 'maps/route3.blk'
import route3Header from 'data/mapHeaders/route3.asm'
import route3Objects from 'data/mapObjects/route3.asm'
import route4Blocks from 'maps/route4.blk'
import route4Header from 'data/mapHeaders/route4.asm'
import route4Objects from 'data/mapObjects/route4.asm'
import route5Blocks from 'maps/route5.blk'
import route5Header from 'data/mapHeaders/route5.asm'
import route5Objects from 'data/mapObjects/route5.asm'
import route6Blocks from 'maps/route6.blk'
import route6Header from 'data/mapHeaders/route6.asm'
import route6Objects from 'data/mapObjects/route6.asm'
import route7Blocks from 'maps/route7.blk'
import route7Header from 'data/mapHeaders/route7.asm'
import route7Objects from 'data/mapObjects/route7.asm'
import route8Blocks from 'maps/route8.blk'
import route8Header from 'data/mapHeaders/route8.asm'
import route8Objects from 'data/mapObjects/route8.asm'
import route9Blocks from 'maps/route9.blk'
import route9Header from 'data/mapHeaders/route9.asm'
import route9Objects from 'data/mapObjects/route9.asm'
import route21Blocks from 'maps/route21.blk'
import route21Header from 'data/mapHeaders/route21.asm'
import route21Objects from 'data/mapObjects/route21.asm'
import route22Blocks from 'maps/route22.blk'
import route22Header from 'data/mapHeaders/route22.asm'
import route22Objects from 'data/mapObjects/route22.asm'
import route24Blocks from 'maps/route24.blk'
import route24Header from 'data/mapHeaders/route24.asm'
import route24Objects from 'data/mapObjects/route24.asm'
import route25Blocks from 'maps/route25.blk'
import route25Header from 'data/mapHeaders/route25.asm'
import route25Objects from 'data/mapObjects/route25.asm'
import ceruleanCityBlocks from 'maps/ceruleancity.blk'
import ceruleanCityHeader from 'data/mapHeaders/ceruleancity.asm'
import ceruleanCityObjects from 'data/mapObjects/ceruleancity.asm'

const objectRegex = /\n\s([a-z_]+)([a-zA-Z_0-9- ,]*)/g

const tilesetNameRegex = /_h:[\s]*db[\ ]*([A-Z_0-9]*)/
const connectionsRegex = /((NORTH|SOUTH|WEST|EAST)_MAP_CONNECTION)([A-Z -_,0-9]*)\s/g

const parseParams = (params: string) =>
  params
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '')

const getHeaders = (input: string) => {
  let match
  let connections: ObjectOf<{ mapName: string; x: number; y: number }> = {}
  while ((match = connectionsRegex.exec(input))) {
    const [, , _direction, params] = match
    const [, mapName, x, y] = parseParams(params)
    const direction = toDirection(_direction)
    if (direction === Direction.N || direction === Direction.S) {
      connections[direction] = { mapName, x: Number(x) - Number(y), y: Number(y) }
    } else {
      connections[direction] = { mapName, x: Number(y), y: Number(x) - Number(y) }
    }
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
  VIRIDIAN_CITY: {
    blocksData: viridianCityBlocks,
    size: MAP_CONSTANTS.VIRIDIAN_CITY,
    objects: getObjects(viridianCityObjects),
    ...getHeaders(viridianCityHeader),
  },
  PEWTER_CITY: {
    blocksData: pewterCityBlocks,
    size: MAP_CONSTANTS.PEWTER_CITY,
    objects: getObjects(pewterCityObjects),
    ...getHeaders(pewterCityHeader),
  },
  SAFFRON_CITY: {
    blocksData: saffronCityBlocks,
    size: MAP_CONSTANTS.SAFFRON_CITY,
    objects: getObjects(saffronCityObjects),
    ...getHeaders(saffronCityHeader),
  },
  ROUTE_1: {
    blocksData: route1Blocks,
    size: MAP_CONSTANTS.ROUTE_1,
    objects: getObjects(route1Objects),
    ...getHeaders(route1Header),
  },
  ROUTE_2: {
    blocksData: route2Blocks,
    size: MAP_CONSTANTS.ROUTE_2,
    objects: getObjects(route2Objects),
    ...getHeaders(route2Header),
  },
  ROUTE_3: {
    blocksData: route3Blocks,
    size: MAP_CONSTANTS.ROUTE_3,
    objects: getObjects(route3Objects),
    ...getHeaders(route3Header),
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
  ROUTE_6: {
    blocksData: route6Blocks,
    size: MAP_CONSTANTS.ROUTE_6,
    objects: getObjects(route6Objects),
    ...getHeaders(route6Header),
  },
  ROUTE_7: {
    blocksData: route7Blocks,
    size: MAP_CONSTANTS.ROUTE_7,
    objects: getObjects(route7Objects),
    ...getHeaders(route7Header),
  },
  ROUTE_8: {
    blocksData: route8Blocks,
    size: MAP_CONSTANTS.ROUTE_8,
    objects: getObjects(route8Objects),
    ...getHeaders(route8Header),
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
  ROUTE_22: {
    blocksData: route22Blocks,
    size: MAP_CONSTANTS.ROUTE_22,
    objects: getObjects(route22Objects),
    ...getHeaders(route22Header),
  },
  ROUTE_24: {
    blocksData: route24Blocks,
    size: MAP_CONSTANTS.ROUTE_24,
    objects: getObjects(route24Objects),
    ...getHeaders(route24Header),
  },
  ROUTE_25: {
    blocksData: route25Blocks,
    size: MAP_CONSTANTS.ROUTE_25,
    objects: getObjects(route25Objects),
    ...getHeaders(route25Header),
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
