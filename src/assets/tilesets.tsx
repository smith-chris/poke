import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { ObjectOf } from 'utils/types'
import { blocksetData } from './blocksets'
import overworldTileset from 'gfx/tilesets/overworld.png'
import overworldCollisions from 'gfx/tilesets/overworld.tilecoll'
import redsHouseTileset from 'gfx/tilesets/reds_house.png'
import redsHouseCollisions from 'gfx/tilesets/reds_house.tilecoll'

type Asset = typeof overworldTileset

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

const makeTexture = (asset: Asset) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height

  return {
    cutTexture: cutTexture(baseTexture),
  }
}

export const OVERWORLD = 'OVERWORLD'

export const tilesetsData = {
  [OVERWORLD]: {
    collisions: overworldCollisions.slice(0, -1),
    blockset: blocksetData.overworld,
  },
  REDS_HOUSE_1: {
    collisions: redsHouseCollisions.slice(0, -1),
    blockset: blocksetData.redsHouse,
  },
}

type TilesetNames = keyof typeof tilesetsData

type Tileset = ReturnType<typeof makeTexture>

export const TILESETS: ObjectOf<Tileset> = {
  [OVERWORLD]: makeTexture(overworldTileset),
  REDS_HOUSE_1: makeTexture(redsHouseTileset),
} as Record<TilesetNames, Tileset>

export type TilesetsData = ObjectOf<typeof tilesetsData.OVERWORLD>
