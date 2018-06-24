import React, { ReactNode } from 'react'
import _overworld from 'gfx/tilesets/overworld.png'
import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { ObjectOf } from 'utils/types'
import { Sprite } from 'react-pixi-fiber'
import { loop } from 'utils/render'
import { Point } from 'utils/pixi'
import flatten from 'lodash.flatten'
import mapValues from 'lodash.mapvalues'

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

const makeTexture = (asset: typeof _overworld) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height
  return {
    ...asset,
    baseTexture,
    cut: cutTexture(baseTexture),
    segments: {} as ObjectOf<ReactNode>,
  }
}

let _ov = makeTexture(_overworld)

const grass = _ov.cut(24, 4, 2, 2)
const grass2 = _ov.cut(18, 6, 2, 2)
const wildGrass = _ov.cut(4, 10, 2, 2)
const fence = _ov.cut(20, 4, 4, 4)

type SpriteDef = {
  texture: Texture
  position: Point
}

const makeSprites = (positions: Array<SpriteDef | Array<SpriteDef>>) =>
  flatten(positions).map(({ texture, position: { x, y } }) => (
    <Sprite
      key={`${x}x${y}`}
      texture={texture}
      position={new Point(x * unit, y * unit)}
    />
  ))

const ovSegments = {
  '52': [
    loop(4, 2, (x, y) => ({ texture: grass, position: new Point(x * 2, y * 2) })),
    { texture: fence, position: new Point(0, 4) },
    { texture: fence, position: new Point(4, 4) },
  ],
  '61': [
    loop(4, 2, (x, y) => ({
      position: new Point(x * 2, y * 2),
      texture: grass2,
    })),
    { position: new Point(0, 4), texture: fence },
    { position: new Point(4, 4), texture: fence },
  ],
  '4f': [
    loop(2, 2, (x, y) => ({
      position: new Point(x * 2, y * 2),
      texture: grass,
    })),
    { position: new Point(4, 0), texture: fence },
    { position: new Point(0, 4), texture: fence },
    { position: new Point(4, 4), texture: fence },
  ],
  '50': [
    loop(2, 2, (x, y) => ({
      position: new Point(x * 2 + 4, y * 2),
      texture: grass,
    })),
    { position: new Point(0, 0), texture: fence },
    { position: new Point(0, 4), texture: fence },
    { position: new Point(4, 4), texture: fence },
  ],
  '4e': [
    loop(2, 4, (x, y) => ({
      position: new Point(x * 2 + 4, y * 2),
      texture: grass,
    })),
    { position: new Point(0, 0), texture: fence },
    { position: new Point(0, 4), texture: fence },
  ],
  '4d': [
    loop(2, 4, (x, y) => ({
      position: new Point(x * 2, y * 2),
      texture: grass,
    })),
    { position: new Point(4, 0), texture: fence },
    { position: new Point(4, 4), texture: fence },
  ],
  '1': [
    { position: new Point(0, 2), texture: grass2 },
    { position: new Point(4, 6), texture: grass2 },
  ],
  b: [
    loop(4, 4, (x, y) => ({
      position: new Point(x * 2, y * 2),
      texture: wildGrass,
    })),
  ],
  a: [
    loop(4, 4, (x, y) => ({
      position: new Point(x * 2, y * 2),
      texture: grass,
    })),
  ],
  '31': [
    loop(4, 4, (x, y) => ({
      position: new Point(x * 2, y * 2),
      texture: grass2,
    })),
  ],
}

_ov.segments = mapValues(ovSegments, (value, key) => {
  return makeSprites(value)
})

export const overworld = _ov
