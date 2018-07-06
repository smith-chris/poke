import _palletTown from 'maps/pallettown.blk'
import { ImageAsset } from '*.png'
import { overworld } from './index'
import { parseHexData } from './utils'

const makeMap = (blockData: string, width = 0, height = 0, texture = overworld) => {
  const tileBlockIds = parseHexData(blockData)
  if (!tileBlockIds) {
    throw new Error(`Couldnt parse the tiles (${blockData})`)
  }
  const tiles = tileBlockIds.map((blockId, i) => ({
    blockId,
    x: i % width,
    y: Math.floor(i / width),
  }))
  return {
    tiles,
    width,
    height,
    texture,
  }
}

export const palletTown = makeMap(_palletTown, 10, 9)
