import React, { Component } from 'react'
import { TilingSprite, TilingSpriteProps, Omit } from 'utils/fiber'
import { Point } from 'utils/point'
import { TILESETS } from 'assets/tilesets'
import { Transition, Steps } from './Transition'
import { TEXTURE_SIZE } from 'assets/const'
import { withTransition, TransitionProps } from 'utils/withTransition'
import { makeStepperFromSteps, evenSteps } from 'utils/transition'

const { OVERWORLD } = TILESETS

const water = OVERWORLD.cutTexture(
  4 * TEXTURE_SIZE,
  1 * TEXTURE_SIZE,
  TEXTURE_SIZE,
  TEXTURE_SIZE,
)

const stepper = makeStepperFromSteps(evenSteps([-2, -1, 0, 1, 2, 1, 0, -1], 350))

type Props = Omit<TilingSpriteProps, 'texture'> & TransitionProps<number>

export const Water = withTransition(stepper, { loop: true }, 'Water')(
  (props: Props) => {
    return (
      <TilingSprite
        {...props}
        tilePosition={new Point(props.data, 0)}
        texture={water}
        width={TEXTURE_SIZE}
        height={TEXTURE_SIZE}
      />
    )
  },
)
