import React, { Component } from 'react'
import { TilingSprite, TilingSpriteProps } from 'utils/fiber'
import { Point } from 'utils/point'
import { TILESETS } from 'assets/tilesets'
import { Transition, Steps } from './Transition'
import { TEXTURE_SIZE } from 'assets/const'

const { OVERWORLD } = TILESETS

const water = OVERWORLD.cutTexture(
  4 * TEXTURE_SIZE,
  1 * TEXTURE_SIZE,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
)

const STEP_DURATION = 350

const STEPS: Steps<number> = [-2, -1, 0, 1, 2, 1, 0, -1].map(
  x => [STEP_DURATION, x] as [number, number],
)

export class Water extends Component<TilingSpriteProps> {
  render() {
    return (
      <Transition
        steps={STEPS}
        loop
        render={x => {
          return (
            <TilingSprite
              {...this.props}
              tilePosition={new Point(x, 0)}
              texture={water}
              width={TEXTURE_SIZE}
              height={TEXTURE_SIZE}
            />
          )
        }}
      />
    )
  }
}
