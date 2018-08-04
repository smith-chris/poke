import React, { Component } from 'react'
import {
  Sprite,
  SpriteProps,
  Container,
  TilingSprite,
  TilingSpriteProps,
} from 'utils/fiber'
import { Point } from 'utils/point'
import { Transition } from './Transition'
import { TILESETS } from 'assets/tilesets'

const TILE_SIZE = 8

const { OVERWORLD } = TILESETS

const water = OVERWORLD.cutTexture(4 * TILE_SIZE, 1 * TILE_SIZE, TILE_SIZE, TILE_SIZE)

const positions = [-2, -1, 0, 1, 2, 1, 0, -1]
const toMs = (frames: number) => frames * 16.666666666666666
const toFrames = (ms: number) => ms / 16.666666666666666

const FRAME_DURATION = 350

export class Water extends Component<TilingSpriteProps> {
  render() {
    return (
      // TODO: make more abstract/flexible Transition component (to work with numbers and maybe arrays apart from Point)
      // I really need to sort that out
      <Transition
        from={new Point(0)}
        to={new Point(toFrames(8 * FRAME_DURATION))}
        speed={1}
        loop
        render={({ x }) => {
          return (
            <TilingSprite
              {...this.props}
              tilePosition={
                new Point(positions[Math.floor(toMs(x) / FRAME_DURATION)], 0)
              }
              texture={water}
              width={8}
              height={8}
            />
          )
        }}
      />
    )
  }
}
