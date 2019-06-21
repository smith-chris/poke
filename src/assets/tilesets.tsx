import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { blocksetData } from './blocksets'
import overworldTileset from 'gfx/tilesets/overworld.png'
import overworldCollisions from 'gfx/tilesets/overworld.tilecoll'
import redsHouseTileset from 'gfx/tilesets/reds_house.png'
import redsHouseCollisions from 'gfx/tilesets/reds_house.tilecoll'
import gymTileset from 'gfx/tilesets/gym.png'
import gymCollisions from 'gfx/tilesets/gym.tilecoll'
import houseTileset from 'gfx/tilesets/house.png'
import houseCollisions from 'gfx/tilesets/house.tilecoll'

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
  '00': {
    collisions: overworldCollisions.slice(0, -1),
    blockset: blocksetData.overworld,
  },
  REDS_HOUSE_1: {
    collisions: redsHouseCollisions.slice(0, -1),
    blockset: blocksetData.redsHouse,
  },
  REDS_HOUSE_2: {
    collisions: redsHouseCollisions.slice(0, -1),
    blockset: blocksetData.redsHouse,
  },
  DOJO: {
    collisions: gymCollisions.slice(0, -1),
    blockset: blocksetData.gym,
  },
  HOUSE: {
    collisions: houseCollisions.slice(0, -1),
    blockset: blocksetData.house,
  },
}

type TilesetNames = keyof typeof tilesetsData

type Tileset = ReturnType<typeof makeTexture>

export const TILESETS: Record<string, Tileset> = {
  [OVERWORLD]: makeTexture(overworldTileset),
  '00': makeTexture(overworldTileset),
  REDS_HOUSE_1: makeTexture(redsHouseTileset),
  REDS_HOUSE_2: makeTexture(redsHouseTileset),
  DOJO: makeTexture(gymTileset),
  HOUSE: makeTexture(houseTileset),
} as Record<TilesetNames, Tileset>

export type TilesetsData = Record<string, typeof tilesetsData.OVERWORLD>
