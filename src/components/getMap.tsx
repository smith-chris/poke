import React from 'react'
import { Segment } from 'assets/tilesets'
import { Sprite, Container } from 'react-pixi-fiber'
import { Point } from 'utils/point'
import { BitmapText } from 'utils/components'
import { Rectangle } from './Rectangle'
import { palletTown } from 'assets/maps'
import { Flower } from './Flower'
import { Water } from './Water'
import { BLOCK_SIZE } from 'assets/const'

const Placeholder = ({ text = '' }) => (
  <>
    <Rectangle width={BLOCK_SIZE} height={BLOCK_SIZE} color="lightGray" />
    <Rectangle x={1} y={1} width={BLOCK_SIZE - 2} height={BLOCK_SIZE - 2} color="red" />
    <BitmapText
      color="white"
      text={text}
      anchor={0.5}
      scale={new Point(2, 2)}
      position={new Point(BLOCK_SIZE / 2, BLOCK_SIZE / 2)}
    />
  </>
)

const renderSegment = (positions: Segment) =>
  positions.map(({ texture, position, type }) => {
    const props = {
      key: `${position.x}x${position.y}`,
      texture,
      position,
    }
    switch (type) {
      case 'flower':
        return <Flower {...props} />
      case 'water':
        return <Water {...props} />
      default:
        return <Sprite {...props} />
    }
  })

export const getMap = (map = palletTown) => {
  return map.tiles.map(({ blockId, x, y }) => {
    const segment = map.texture.getBlock(blockId)
    return (
      <Container
        key={`${blockId}_${x}x${y}`}
        position={new Point(x * BLOCK_SIZE, y * BLOCK_SIZE)}
      >
        {segment ? renderSegment(segment) : <Placeholder text={blockId.toString()} />}
      </Container>
    )
  })
}
