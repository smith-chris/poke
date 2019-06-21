import React from 'react'
import { Sprite } from 'utils/fiber'
import { Texture } from 'pixi.js'
import { makeStepperFromSteps } from 'components/withTransition/transition'
import {
  withTransition,
  TransitionProps,
} from 'components/withTransition/withTransition'
import { Point } from 'utils/point'
import _flower1 from 'gfx/tilesets/flower/flower1.png'
import _flower2 from 'gfx/tilesets/flower/flower2.png'
import _flower3 from 'gfx/tilesets/flower/flower3.png'

// Animation goes like this
// flower1 - 700ms - flower2 - 350ms - flower3 - 350ms - flower1... and so on
// so its 1400ms total

const [flower1, flower2, flower3] = [_flower1, _flower2, _flower3].map(tx =>
  Texture.fromImage(tx.src),
)

const withFlowerTransition = withTransition(
  makeStepperFromSteps([[700, flower1], [350, flower2], [350, flower3]]),
  { loop: true },
  'Flower',
)

type Props = { position: Point } & TransitionProps<Texture>

export const Flower = withFlowerTransition(
  ({ data: texture, position = Point.ZERO }: Props) => (
    <Sprite position={position} texture={texture} />
  ),
)
