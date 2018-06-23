import _overworld from 'gfx/tilesets/overworld.png'
import { Texture, BaseTexture, Rectangle } from 'pixi.js'

export const unit = 4

const cutTexture = (baseTexture: BaseTexture) => (
  x = 0,
  y = 0,
  width = 1 * unit,
  height = 1 * unit,
) => {
  const tx = new Texture(baseTexture)
  tx.frame = new Rectangle(x * unit, y * unit, width * unit, height * unit)
  return tx
}

const addTexture = (asset: typeof _overworld) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height
  return { ...asset, baseTexture, cut: cutTexture(baseTexture) }
}

export const overworld = addTexture(_overworld)
