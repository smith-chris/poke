import React, { Component } from 'react'
import { overworld, Segment } from 'assets'
import { Sprite, Container } from 'react-pixi-fiber'
import { Point } from 'utils/pixi'
import { loop } from 'utils/render'
import { BitmapText } from 'utils/components'
import { Rectangle } from './Rectangle'
import { palletTown } from 'assets/maps'
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

const makeSprites = (positions: Segment) =>
  positions.map(({ texture, position: { x, y } }) => (
    <Sprite key={`${x}x${y}`} texture={texture} position={new Point(x, y)} />
  ))

type Props = {}

export class PalletTown extends Component<Props> {
  render() {
    return (
      <>
        {palletTown.tiles.map(({ blockId, x, y }) => {
          const segment = palletTown.texture.getBlock(blockId)
          return (
            <Container
              key={`${blockId}_${x}x${y}`}
              position={new Point(x * tileSize, y * tileSize)}
            >
              {segment ? (
                makeSprites(segment)
              ) : (
                <Placeholder text={blockId.toString()} />
              )}
            </Container>
          )
        })}
      </>
    )
  }
}
