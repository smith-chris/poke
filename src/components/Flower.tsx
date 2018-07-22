import React, { Component } from 'react'
import { Sprite, SpriteProps } from 'utils/fiber'
import { Texture } from 'pixi.js'
import { Point } from 'utils/point'
import { Transition } from './Transition'
import _flower1 from 'gfx/tilesets/flower/flower1.png'
import _flower2 from 'gfx/tilesets/flower/flower2.png'
import _flower3 from 'gfx/tilesets/flower/flower3.png'
import { ObjectOf } from 'utils/types'

// Animation goes like this
// flower1 - 700ms - flower2 - 350ms - flower3 - 350ms - flower1... and so on
// so its 1400ms total

const toMs = (frames: number) => frames * 16.666666666666666
const toFrames = (ms: number) => ms / 16.666666666666666

const [flower1, flower2, flower3] = [_flower1, _flower2, _flower3].map(tx =>
  Texture.fromImage(tx.src),
)
const textures: ObjectOf<Texture> = { flower1, flower2, flower3 }

const getTexture = (ms: number) => {
  if (ms > 700 && ms <= 1050) {
    return flower2
  } else if (ms > 1050) {
    return flower3
  }
  return flower1
}

export class Flower extends Component<SpriteProps> {
  render() {
    return (
      // TODO: make more abstract/flexible Transition component (to work with numbers and maybe arrays apart from Point)
      // I really need to sort that out
      <Transition
        from={new Point(1)}
        to={new Point(toFrames(1400))}
        speed={1}
        loop
        render={({ x }) => {
          return <Sprite {...this.props} texture={getTexture(toMs(x))} />
        }}
      />
    )
  }
}
