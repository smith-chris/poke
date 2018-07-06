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

const getSegment = (hex: number, blocks: Texture[]) => {
  return loop(4, 4, (y, x) => ({ x: x * 8, y: y * 8 })).map((position, i) => {
    return {
      texture: blocks[i],
      position: position as Point,
    }
  })
}

export type Segment = ReturnType<typeof getSegment>

const getBlockTexture = (hex: number, baseTexture: BaseTexture) => {
  const ids = getTextureLocationHexes(hex)
  return ids.map(num => {
    const px = num * 8
    return cutTexture(baseTexture)(
      px % baseTexture.width,
      Math.floor(px / baseTexture.width) * 8,
      8,
      8,
    )
  })
}

const makeTexture = (asset: Asset) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height

  return {
    ...asset,
    baseTexture,
    getBlock: (hex: number) => getSegment(hex, getBlockTexture(hex, baseTexture)),
  }
}

let _overworldObject = makeTexture(_overworld)

export const overworld = _overworldObject
