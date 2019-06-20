import React, { ComponentClass } from 'react'
import { Sprite, SpriteProps } from 'utils/fiber'
import { Point } from 'utils/point'
import { TILESETS } from 'assets/tilesets'
import { TEXTURE_SIZE } from 'assets/const'
import { withTransition, TransitionProps } from 'utils/withTransition'
import { makeStepperFromSteps, evenSteps } from 'utils/transition'
import { Container } from 'utils/fiber'

const { OVERWORLD } = TILESETS

const animationMaxOffset = 2
const textureLeftOffset = TEXTURE_SIZE - animationMaxOffset

const waterMiddle = OVERWORLD.cutTexture(
  4 * TEXTURE_SIZE,
  1 * TEXTURE_SIZE,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
)

const waterRight = OVERWORLD.cutTexture(
  4 * TEXTURE_SIZE,
  1 * TEXTURE_SIZE,
  animationMaxOffset,
  TEXTURE_SIZE,
)

const waterLeft = OVERWORLD.cutTexture(
  4 * TEXTURE_SIZE + textureLeftOffset,
  1 * TEXTURE_SIZE,
  animationMaxOffset,
  TEXTURE_SIZE,
)

const offsets = [-2, -1, 0, 1, 2, 1, 0, -1]
const sprites = offsets.map(offset => {
  const result = [
    <Sprite key="waterMiddle" texture={waterMiddle} position={new Point(offset, 0)} />,
  ]
  if (offset < 0) {
    result.push(
      <Sprite
        key="waterRight"
        texture={waterRight}
        position={new Point(offset + TEXTURE_SIZE, 0)}
      />,
    )
  } else if (offset > 0) {
    result.push(
      <Sprite
        key="waterLeft"
        texture={waterLeft}
        position={new Point(offset - animationMaxOffset, 0)}
      />,
    )
  }
  return result
})
const withWaterTransition = withTransition(
  makeStepperFromSteps(evenSteps(sprites, 350)),
  { loop: true },
  'Water',
)
type Props = { position: Point } & TransitionProps<JSX.Element[]>

export const Water = withWaterTransition(
  ({ data: sprite, position = Point.ZERO }: Props) => (
    <Container position={position}>{sprite}</Container>
  ),
)
