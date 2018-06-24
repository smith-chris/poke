import React, { ReactNode } from 'react'
import _overworld from 'gfx/tilesets/overworld.png'
import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { ObjectOf } from 'utils/types'
import { Sprite } from 'react-pixi-fiber'
import { loop } from 'utils/render'
import { Point } from 'utils/pixi'
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

_ov.segments['52'] = (
  <>
    {loop(4, 2, (x, y) => (
      <Sprite
        key={`52_${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={grass}
      />
    ))}
    <Sprite position={new Point(0, unit * 4)} texture={fence} />
    <Sprite position={new Point(unit * 4, unit * 4)} texture={fence} />
  </>
)

_ov.segments['61'] = (
  <>
    {loop(4, 2, (x, y) => (
      <Sprite
        key={`${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={grass2}
      />
    ))}
    <Sprite position={new Point(0, unit * 4)} texture={fence} />
    <Sprite position={new Point(unit * 4, unit * 4)} texture={fence} />
  </>
)

_ov.segments['4f'] = (
  <>
    {loop(2, 2, (x, y) => (
      <Sprite
        key={`4f_${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={grass}
      />
    ))}
    <Sprite position={new Point(unit * 4, 0)} texture={fence} />
    <Sprite position={new Point(0, unit * 4)} texture={fence} />
    <Sprite position={new Point(unit * 4, unit * 4)} texture={fence} />
  </>
)

_ov.segments['50'] = (
  <>
    {loop(2, 2, (x, y) => (
      <Sprite
        key={`50_${x}x${y}`}
        position={new Point(x * unit * 2 + 4 * unit, y * unit * 2)}
        texture={grass}
      />
    ))}
    <Sprite position={new Point(0, 0)} texture={fence} />
    <Sprite position={new Point(0, unit * 4)} texture={fence} />
    <Sprite position={new Point(unit * 4, unit * 4)} texture={fence} />
  </>
)

_ov.segments['4e'] = (
  <>
    {loop(2, 4, (x, y) => (
      <Sprite
        key={`e1_${x}x${y}`}
        position={new Point(x * unit * 2 + unit * 4, y * unit * 2)}
        texture={grass}
      />
    ))}
    <Sprite position={new Point(0, 0)} texture={fence} />
    <Sprite position={new Point(0, unit * 4)} texture={fence} />
  </>
)

_ov.segments['4d'] = (
  <>
    {loop(2, 4, (x, y) => (
      <Sprite
        key={`${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={grass}
      />
    ))}
    <Sprite position={new Point(4 * unit, 0)} texture={fence} />
    <Sprite position={new Point(4 * unit, unit * 4)} texture={fence} />
  </>
)

_ov.segments['1'] = (
  <>
    <Sprite position={new Point(0, unit * 2)} texture={grass2} />
    <Sprite position={new Point(unit * 4, unit * 6)} texture={grass2} />
  </>
)

_ov.segments.b = (
  <>
    {loop(4, 4, (x, y) => (
      <Sprite
        key={`b5_${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={wildGrass}
      />
    ))}
  </>
)

_ov.segments.a = (
  <>
    {loop(4, 4, (x, y) => (
      <Sprite
        key={`a_${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={grass}
      />
    ))}
  </>
)

_ov.segments['31'] = (
  <>
    {loop(4, 4, (x, y) => (
      <Sprite
        key={`${x}x${y}`}
        position={new Point(x * unit * 2, y * unit * 2)}
        texture={grass2}
      />
    ))}
  </>
)

// _ov.segments = {}

export const overworld = _ov
