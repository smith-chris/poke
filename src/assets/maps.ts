import _palletTown from 'maps/pallettown.blk'
import _palletTownConfig from 'data/mapHeaders/pallettown.asm'
import _agatha from 'maps/agatha.blk'
import _agathaConfig from 'data/mapHeaders/agatha.asm'
import _route1 from 'maps/route1.blk'
import _route1Config from 'data/mapHeaders/route1.asm'
import { parseHexData } from './utils'
import { MAP_CONSTANTS } from 'const/map'
import { TILESETS, DEFAULT_TILESET_NAME } from './tilesets'
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

const makeMap = (blockData: string, { width = 0 }, tilesetName?: string) => {
  const tileBlockIds = parseHexData(blockData)
  if (!tileBlockIds) {
    throw new Error(`Couldnt parse the tiles (${blockData})`)
  }
  const tiles = tileBlockIds.map((blockId, i) => ({
    blockId,
    x: i % width,
    y: Math.floor(i / width),
  }))
  const texture =
    (tilesetName && TILESETS[tilesetName]) || TILESETS[DEFAULT_TILESET_NAME]

  let collisions: ObjectOf<boolean> = {}

  tiles.forEach(({ x, y, blockId }) => {
    // each block is 32x32 px which means it consists of 4 collisions
    const segment = texture.getBlockCollisions(blockId)
    const baseX = x * 2
    const baseY = y * 2

    collisions = {
      ...collisions,
      [`${baseX}_${baseY}`]: segment[4],
      [`${baseX + 1}_${baseY}`]: segment[6],
      [`${baseX}_${baseY + 1}`]: segment[12],
      [`${baseX + 1}_${baseY + 1}`]: segment[14],
    }
  })
  return {
    tiles,
    width,
    texture,
    collisions,
  }
}

export type MapData = ReturnType<typeof makeMap>

export const palletTown = makeMap(
  _palletTown,
  MAP_CONSTANTS.PALLET_TOWN,
  getTilesetName(_palletTownConfig),
)
export const route1 = makeMap(
  _route1,
  MAP_CONSTANTS.ROUTE_1,
  getTilesetName(_route1Config),
)
export const agatha = makeMap(
  _agatha,
  MAP_CONSTANTS.AGATHAS_ROOM,
  getTilesetName(_agathaConfig),
)
