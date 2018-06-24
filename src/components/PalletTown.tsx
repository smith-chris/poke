import React, { Component } from 'react'
import { Roof } from './Roof'
import { overworld, unit } from 'assets'
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
      position={new Point(tileSize / 2, tileSize / 2)}
    />
  </>
)

const window = overworld.cut(20, 0, 2, 2)

type Props = {}

const roofHeight = 6
const middleTop = (roofHeight - 2) * unit

export class PalletTown extends Component<Props> {
  render() {
    return (
      <>
        {palletTown.tiles.map(({ tile, x, y }) => (
          <Container
            key={`${tile}_${x}x${y}`}
            position={new Point(x * tileSize, y * tileSize)}
          >
            <Placeholder text={tile} />
          </Container>
        ))}
      </>
    )
  }
}
