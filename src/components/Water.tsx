import React, { Component } from 'react'
import { TilingSprite, TilingSpriteProps } from 'utils/fiber'
import { Point } from 'utils/point'
import { TILESETS } from 'assets/tilesets'
import { Transition2 } from './Transition2'

const TILE_SIZE = 8

const { OVERWORLD } = TILESETS

const water = OVERWORLD.cutTexture(4 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE)

const STEP_DURATION = 350

const STEPS = [-2, -1, 0, 1, 2, 1, 0, -1].map(
  x => [STEP_DURATION, x] as [number, number],
)

export class Water extends Component<TilingSpriteProps> {
  render() {
    return (
      <Transition2
        steps={STEPS}
        loop
        render={x => {
          return (
            <TilingSprite
              {...this.props}
              tilePosition={new Point(x, 0)}
              texture={water}
              width={TILE_SIZE}
              height={TILE_SIZE}
            />
          )
        }}
      />
    )
  }
}
