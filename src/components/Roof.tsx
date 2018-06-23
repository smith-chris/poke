import React, { Component } from 'react'
import { Sprite, Container } from 'react-pixi-fiber'
import { Texture, Rectangle, Point } from 'pixi.js'
import { overworld, unit } from 'assets'
import { loop } from 'utils/render'

const POINT_ZERO = new Point(0, 0)
const TEXTURE_ZERO = Texture.EMPTY

const roofRight = overworld.cut(16, 0, 4, 6)
const roofRightTop = overworld.cut(16, 0, 4, 2)
const roofRightMid = overworld.cut(16, 2, 4, 1)
const roofRightBottom = overworld.cut(16, 3, 4, 3)

const roofLeft = overworld.cut(10, 0, 4, 6) // height = 6
const roofLeftTop = overworld.cut(10, 0, 4, 2)
const roofLeftMid = overworld.cut(10, 2, 4, 1)
const roofLeftBottom = overworld.cut(10, 3, 4, 3)

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
  const midRenderedHeight = height - topHeight - bottomHeight
  const mid = loop(midRenderedHeight, i => (
    <Sprite
      key={`${id}_${i}`}
      texture={midTexture}
      position={new Point(0, topHeight * unit + i * unit)}
    />
  ))
  const midBottom = (topHeight + midRenderedHeight) * unit
  return (
    <>
      <Sprite texture={topTexture} position={new Point(0, 0)} />
      {mid}
      <Sprite texture={bottomTexture} position={new Point(0, midBottom)} />
    </>
  )
}

const roofMid = overworld.cut(14, 0, 2, 4)
const midTopHeight = 5 / unit
const roofMidTop = overworld.cut(14, 0, 2, midTopHeight)
const midBottomHeight = 2
const roofMidBottom = overworld.cut(14, 2, 2, midBottomHeight)

const getRoofMid = (width = 2, height = 4) => {
  if (height === 4) {
    return loop(width / 2, x => (
      <Sprite
        key={`roofMid_${x}`}
        texture={roofMid}
        position={new Point(x * unit * 2, 0)}
      />
    ))
  }
  const midHeight = Math.round(height - midTopHeight - midBottomHeight)

  const top = loop(width / 2, x => (
    <Sprite
      key={`top_${x}`}
      texture={roofMidTop}
      position={new Point(x * unit * 2, 0)}
    />
  ))

  const midBottom = (midTopHeight + midHeight) * unit - 1
  const bottom = loop(width / 2, x => (
    <Sprite
      key={`bottom_${x}`}
      texture={roofMidBottom}
      position={new Point(x * unit * 2, midBottom)}
    />
  ))

  return (
    <>
      {getPattern((width + 1) / 2, midHeight / 2, 4)}
      {top}
      {bottom}
    </>
  )
}

const roofPattern = overworld.cut(4, 2, 2, 2)

const getPattern = (width = 1, height = 1, _y = 0) =>
  loop(width, height, (x, y) => (
    <Sprite
      key={`${x}x${y}`}
      texture={roofPattern}
      position={new Point(x * unit * 2 - unit, _y + y * unit * 2)}
    />
  ))

const MIN_WIDTH = 8
const MIN_HEIGHT = 6

const ROOF_SIDE_WIDTH = 4

type Props = {
  width?: number
  height?: number
}

export class Roof extends Component<Props> {
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
