import _overworld from 'gfx/tilesets/overworld.png'
import _overworldCollisions from 'gfx/tilesets/overworld.tilecoll'
import _cemetery from 'gfx/tilesets/cemetery.png'
import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { ObjectOf } from 'utils/types'
import { blocksetData } from './blocksets'

type Asset = typeof _overworld

const cutTexture = (baseTexture: BaseTexture) => (
  x = 0,
  y = 0,
  width = 1,
  height = 1,
) => {
  const tx = new Texture(baseTexture)
  tx.frame = new Rectangle(x, y, width, height)
  return tx
}

const makeTexture = (asset: Asset, name: string) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height

  return {
    cutTexture: cutTexture(baseTexture),
  }
}

export const DEFAULT_TILESET_NAME = 'OVERWORLD'

export const TILESETS: ObjectOf<ReturnType<typeof makeTexture>> = {
  [DEFAULT_TILESET_NAME]: makeTexture(_overworld, DEFAULT_TILESET_NAME),
  CEMETERY: makeTexture(_cemetery, 'CEMETERY'),
}

export const tilesetsData = {
  overworld: {
    collisions: _overworldCollisions.slice(0, -1),
    blockset: blocksetData.overworld,
  },
}

export type TilesetsData = ObjectOf<typeof tilesetsData.overworld>
