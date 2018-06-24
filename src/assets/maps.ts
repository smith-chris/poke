import _palletTown from 'maps/pallettown.blk'
import { ImageAsset } from '*.png'
import { overworld } from './index'

const ascii2hex = (input: string) => {
  var arr = []
  for (var i = 0, l = input.length; i < l; i++) {
    var hex = Number(input.charCodeAt(i)).toString(16)
    arr.push(hex)
  }
  return arr
}

const makeMap = (tiles: string, width = 0, height = 0, texture = overworld) => {
  const parsedTiles = ascii2hex(tiles)
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
