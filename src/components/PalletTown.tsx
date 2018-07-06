import React, { Component } from 'react'
import { overworld } from 'assets'
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

type Props = {}

export class PalletTown extends Component<Props> {
  render() {
    return (
      <>
        {palletTown.tiles.map(({ tile, x, y }) => {
          const segment = palletTown.texture.getBlock(tile)
          return (
            <Container
              key={`${tile}_${x}x${y}`}
              position={new Point(x * tileSize, y * tileSize)}
            >
              {segment ? segment : <Placeholder text={tile.toString()} />}
            </Container>
          )
        })}
      </>
    )
  }
}
