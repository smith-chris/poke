import React, { Component } from 'react'
import { Sprite, SpriteProps, Omit } from 'utils/fiber'
import { Texture } from 'pixi.js'
import _flower1 from 'gfx/tilesets/flower/flower1.png'
import _flower2 from 'gfx/tilesets/flower/flower2.png'
import _flower3 from 'gfx/tilesets/flower/flower3.png'
import { makeStepperFromSteps } from 'utils/transition'
import { withTransition, TransitionProps } from 'utils/withTransition'

// Animation goes like this
// flower1 - 700ms - flower2 - 350ms - flower3 - 350ms - flower1... and so on
// so its 1400ms total

const [flower1, flower2, flower3] = [_flower1, _flower2, _flower3].map(tx =>
  Texture.fromImage(tx.src),
)

const stepper = makeStepperFromSteps([[700, flower1], [350, flower2], [350, flower3]])

type Props = Omit<SpriteProps, 'texture'> & TransitionProps<Texture>

export const Flower = withTransition(stepper, { loop: true })(
  class extends Component<Props> {
    render() {
      return <Sprite {...this.props} texture={this.props.data} />
    }
  },
)
