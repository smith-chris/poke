import React, { ReactNode } from 'react'
import _overworld from 'gfx/tilesets/overworld.png'
import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { ObjectOf } from 'utils/types'
import { Sprite } from 'react-pixi-fiber'
import { loop } from 'utils/render'
import { Point } from 'utils/pixi'
import flatten from 'lodash.flatten'
import mapValues from 'lodash.mapvalues'
import { parseHexData } from './utils'
import { getTextureLocationHexes } from './blocksets'

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

type SpriteDef = {
  texture: Texture
  position: Point
}

const makeSprites = (positions: Array<SpriteDef | Array<SpriteDef>>) =>
  flatten(positions).map(({ texture, position: { x, y } }) => (
    <Sprite key={`${x}x${y}`} texture={texture} position={new Point(x, y)} />
  ))

const getSegment = (hex: number, blocks: Texture[]) => {
  return loop(4, 4, (y, x) => ({ x: x * 8, y: y * 8 })).map((position, i) => {
    return {
      texture: blocks[i],
      position: position as Point,
    }
  })
}

const makeTexture = (asset: typeof _overworld) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height
  const getBlockTexture = (hex: number) => {
    const ids = getTextureLocationHexes(hex)
    return ids.map(num => {
      const px = num * 8
      return cutTexture(baseTexture)(
        px % asset.width,
        Math.floor(px / asset.width) * 8,
        8,
        8,
      )
    })
  }
  return {
    ...asset,
    baseTexture,
    getBlock: (hex: number) => makeSprites(getSegment(hex, getBlockTexture(hex))),
  }
}

let _overworldObject = makeTexture(_overworld)

export const overworld = _overworldObject
