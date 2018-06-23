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
  return { ...asset, baseTexture, cut: cutTexture(baseTexture) }
}

export const overworld = addTexture(_overworld)
