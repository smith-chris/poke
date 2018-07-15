import React, { ReactNode } from 'react'
import _overworld from 'gfx/tilesets/overworld.png'
import _cemetery from 'gfx/tilesets/cemetery.png'
import { Texture, BaseTexture, Rectangle } from 'pixi.js'
import { ObjectOf } from 'utils/types'
import { Sprite } from 'react-pixi-fiber'
import { loop } from 'utils/render'
import { Point } from 'utils/point'
import mapValues from 'lodash.mapvalues'
import { parseHexData } from './utils'
import { getTextureLocationHexes } from './blocksets'
import { Rectangle as CustomRectangle } from '../components/Rectangle'

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

import _overworldCollisions from 'gfx/tilesets/overworld.tilecoll'
import { palette } from 'styles/palette'

let overworldCollisions = parseHexData(_overworldCollisions)
  .slice(0, -1)
  .filter(n => ![51, 84].includes(n))
overworldCollisions.push(3)

const getSegment = (hex: number, blocks: ReturnType<typeof getBlockTexture>) => {
  return loop(4, 4, (y, x) => ({ x: x * 8, y: y * 8 })).map((position, i) => {
    return {
      collides: overworldCollisions.includes(blocks[i].id),
      texture: blocks[i].texture,
      position: position as Point,
    }
  })
}

export type Segment = ReturnType<typeof getSegment>

const getBlockTexture = (
  hex: number,
  baseTexture: BaseTexture,
  blocksetName: string,
) => {
  const ids = getTextureLocationHexes(hex, blocksetName)
  return ids.map(num => {
    const px = num * 8
    return {
      texture: cutTexture(baseTexture)(
        px % baseTexture.width,
        Math.floor(px / baseTexture.width) * 8,
        8,
        8,
      ),
      id: num,
    }
  })
}

const makeTexture = (asset: Asset, name: string) => {
  const { baseTexture } = Texture.fromImage(asset.src)
  // Seems like pixi do not read b64 image dimensions correctly
  baseTexture.width = asset.width
  baseTexture.height = asset.height

  return {
    ...asset,
    baseTexture,
    getBlock: (hex: number) => getSegment(hex, getBlockTexture(hex, baseTexture, name)),
  }
}

export const DEFAULT_TILESET_NAME = 'OVERWORLD'

export const TILESETS: ObjectOf<ReturnType<typeof makeTexture>> = {
  [DEFAULT_TILESET_NAME]: makeTexture(_overworld, DEFAULT_TILESET_NAME),
  CEMETERY: makeTexture(_cemetery, 'CEMETERY'),
}

// const OT = Texture.fromImage(_overworld.src)
// export const TEST = (
//   <>
//     <Sprite texture={OT} />
//     {overworldCollisions
//       .map(px => ({
//         x: (px * 8) % 128,
//         y: Math.floor((px * 8) / 128) * 8,
//       }))
//       .filter(({ x, y }) => x <= 128 - 8 && y <= 48 - 8)
//       .map(p => (
//         <CustomRectangle
//           key={`${p.x}x${p.y}`}
//           position={p}
//           width={8}
//           height={8}
//           color="green"
//           alpha={0.4}
//         />
//       ))}
//   </>
// )
