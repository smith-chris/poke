import React, { Component } from 'react'
import { Sprite, Container } from 'react-pixi-fiber'
import overworld from 'gfx/tilesets/overworld.png'
import { Texture, Rectangle, Point } from 'pixi.js'

const POINT_ZERO = new Point(0, 0)
const { baseTexture } = Texture.fromImage(overworld.src)
const TEXTURE_ZERO = new Texture(baseTexture)

const unit = 4

const getTexture = (x = 0, y = 0, width = 1 * unit, height = 1 * unit) => {
  const tx = new Texture(baseTexture)
  tx.frame = new Rectangle(x, y, width, height)
  return tx
}

const getTextureSimple = (x = 0, y = 0, width = 1, height = 1) =>
  getTexture(x * unit, y * unit, width * unit, height * unit)

const roofRight = getTextureSimple(16, 0, 4, 6)
const roofRightTop = getTextureSimple(16, 0, 4, 2)
const roofRightMid = getTextureSimple(16, 2, 4, 1)
const roofRightBottom = getTextureSimple(16, 3, 4, 3)

const roofLeft = getTextureSimple(10, 0, 4, 6) // height = 6
const roofLeftTop = getTextureSimple(10, 0, 4, 2)
const roofLeftMid = getTextureSimple(10, 2, 4, 1)
const roofLeftBottom = getTextureSimple(10, 3, 4, 3)

const getRoofLeft = (height = 6, id = '') => {
  return threePieceVertTexture({
    topHeight: 2,
    midHeight: 1,
    bottomHeight: 3,
    id: 'roofLeft',
    topTexture: roofLeftTop,
    midTexture: roofLeftMid,
    bottomTexture: roofLeftBottom,
    height,
  })
}

const getRoofRight = (height = 6, id = '') => {
  return threePieceVertTexture({
    topHeight: 2,
    midHeight: 1,
    bottomHeight: 3,
    id: 'roofRight',
    topTexture: roofRightTop,
    midTexture: roofRightMid,
    bottomTexture: roofRightBottom,
    height,
  })
}

const threePieceVertTexture = ({
  topHeight = 0,
  midHeight = 0,
  bottomHeight = 0,
  height = 0,
  id = '',
  topTexture = TEXTURE_ZERO,
  midTexture = TEXTURE_ZERO,
  bottomTexture = TEXTURE_ZERO,
}) => {
  const mid = []
  const midRenderedHeight = height - topHeight - bottomHeight
  for (let i = 0; i < midRenderedHeight; i += 1) {
    mid.push(
      <Sprite
        key={`${id}_${i}`}
        texture={midTexture}
        position={new Point(0, topHeight * unit + i * unit)}
      />,
    )
  }
  const midBottom = (topHeight + midRenderedHeight) * unit
  return (
    <>
      <Sprite texture={topTexture} position={new Point(0, 0)} />
      {mid}
      <Sprite texture={bottomTexture} position={new Point(0, midBottom)} />
    </>
  )
}

const roofMid = getTextureSimple(14, 0, 2, 4)
const midTopHeight = 5 / unit
const roofMidTop = getTextureSimple(14, 0, 2, midTopHeight)
const midBottomHeight = 2
const roofMidBottom = getTextureSimple(14, 2, 2, midBottomHeight)

const getRoofMid = (width = 2, height = 4) => {
  if (height === 4) {
    const result = []
    for (let x = 0; x < width / 2; x++) {
      result.push(
        <Sprite
          key={`roofMid_${x}`}
          texture={roofMid}
          position={new Point(x * unit * 2, 0)}
        />,
      )
    }
    return result
  }
  const midHeight = Math.round(height - midTopHeight - midBottomHeight)

  const top = []
  for (let x = 0; x < width / 2; x++) {
    top.push(
      <Sprite
        key={`top_${x}`}
        texture={roofMidTop}
        position={new Point(x * unit * 2, 0)}
      />,
    )
  }

  const midBottom = (midTopHeight + midHeight) * unit - 1
  const bottom = []
  for (let x = 0; x < width / 2; x++) {
    bottom.push(
      <Sprite
        key={`bottom_${x}`}
        texture={roofMidBottom}
        position={new Point(x * unit * 2, midBottom)}
      />,
    )
  }

  return (
    <>
      {getPattern((width + 1) / 2, midHeight / 2, 4)}
      {top}
      {bottom}
    </>
  )
}

const roofPattern = getTextureSimple(4, 2, 2, 2)

const getPattern = (width = 1, height = 1, _y = 0) => {
  const results = []
  for (let x = 0; x <= width; x++) {
    for (let y = 0; y < height; y++) {
      results.push(
        <Sprite
          key={`${x}x${y}`}
          texture={roofPattern}
          position={new Point(x * unit * 2 - unit, _y + y * unit * 2)}
        />,
      )
    }
  }
  return results
}

const MIN_WIDTH = 8
const MIN_HEIGHT = 6

const ROOF_SIDE_WIDTH = 4

type Props = {
  width?: number
  height?: number
}

export class House extends Component<Props> {
  render() {
    let { width, height } = this.props
    if (!width || width < MIN_WIDTH) {
      width = MIN_WIDTH
    }
    if (!height || height < MIN_HEIGHT) {
      height = MIN_HEIGHT
    }

    return (
      <>
        {width > MIN_WIDTH && (
          <Container position={new Point(4 * unit, 0)}>
            {getRoofMid(width - ROOF_SIDE_WIDTH * 2, height - 2)}
          </Container>
        )}
        {getRoofLeft(height)}
        <Container position={new Point((width - ROOF_SIDE_WIDTH) * unit, 0)}>
          {getRoofRight(height)}
        </Container>
      </>
    )
  }
}
