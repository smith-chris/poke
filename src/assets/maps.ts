import _palletTown from 'maps/pallettown.blk'
import { ImageAsset } from '*.png'
import { overworld } from './index'
import { parseHexData } from './utils'

const makeMap = (tiles: string, width = 0, height = 0, texture = overworld) => {
  const parsedTiles = parseHexData(tiles)
  if (!parsedTiles) {
    throw new Error(`Couldnt parse the tiles (${tiles})`)
  }
  const parsedTiles2 = parsedTiles.map((tile, i) => ({
    tile,
    x: i % width,
    y: Math.floor(i / width),
  }))
  return {
    tiles: parsedTiles2,
    width,
    height,
    texture,
  }
}

export const palletTown = makeMap(_palletTown, 10, 9)
