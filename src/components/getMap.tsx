import React from 'react'
import { Segment } from 'assets/tilesets'
import { Sprite, Container } from 'react-pixi-fiber'
import { Point } from 'utils/point'
import { BitmapText } from 'utils/components'
import { Rectangle } from './Rectangle'
import { palletTown } from 'assets/maps'
import { Flower } from './Flower'
const tileSize = 32

const Placeholder = ({ text = '' }) => (
  <>
    <Rectangle width={tileSize} height={tileSize} color="lightGray" />
    <Rectangle x={1} y={1} width={tileSize - 2} height={tileSize - 2} color="red" />
    <BitmapText
      color="white"
      text={text}
      anchor={0.5}
      scale={new Point(2, 2)}
      position={new Point(tileSize / 2, tileSize / 2)}
    />
  </>
)

const renderSegment = (positions: Segment) =>
  positions.map(({ texture, position, isFlower }) => {
    const props = {
      key: `${position.x}x${position.y}`,
      texture,
      position,
    }
    return isFlower ? <Flower {...props} /> : <Sprite {...props} />
  })

export const getMap = (map = palletTown) => {
  return map.tiles.map(({ blockId, x, y }) => {
    const segment = map.texture.getBlock(blockId)
    return (
      <Container
        key={`${blockId}_${x}x${y}`}
        position={new Point(x * tileSize, y * tileSize)}
      >
        {segment ? renderSegment(segment) : <Placeholder text={blockId.toString()} />}
      </Container>
    )
  })
}
