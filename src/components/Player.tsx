import React, { Component, ReactNode } from 'react'
import { Container, Sprite } from 'utils/fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions } from 'store/game'
import { store } from 'store/store'
import { Texture, Rectangle } from 'pixi.js'
import red from 'gfx/sprites/red.png'
import { Point } from 'utils/point'
import { assertNever } from 'utils/other'
import { Transition } from './Transition'
import { MOVE_TICKS, MOVE_DISTANCE } from './Game'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

// Figure out later why the fuck importing it from 'store/game' breaks the build
export enum Direction {
  N = 'N',
  E = 'E',
  W = 'W',
  S = 'S',
}

const baseTexture = Texture.fromImage(red.src).baseTexture
const [texS, texS2, texN, texN2, texW, texW2] = [0, 48, 16, 64, 32, 80].map(y => {
  const result = new Texture(baseTexture)
  result.frame = new Rectangle(0, y, 16, 16)
  return result
})

const choosePlayerTexture = (px: number, tex: Texture, tex2: Texture) =>
  px > 8 ? tex2 : tex

const getPlayerSpriteProps = (direction: Direction, px: number, flipX?: boolean) => {
  const scale = flipX ? new Point(-1, 1) : new Point(1, 1)
  switch (direction) {
    case Direction.N:
      return { texture: choosePlayerTexture(px, texN, texN2), scale }
    case Direction.E:
      return { texture: choosePlayerTexture(px, texW, texW2), scale: new Point(-1, 1) }
    case Direction.W:
      return { texture: choosePlayerTexture(px, texW, texW2) }
    case Direction.S:
      return { texture: choosePlayerTexture(px, texS, texS2), scale }
    default:
      return assertNever(direction)
  }
}

const defaultState = {
  direction: Direction.S,
  animate: false,
  flipX: false,
}

const spriteBaseProps = {
  position: new Point(64 + 8, 64 + 8),
  anchor: new Point(0.5, 0.5),
  scale: new Point(1, 1),
}

class PlayerComponent extends Component<Props, typeof defaultState> {
  state = defaultState
  componentWillReceiveProps({ game: { controls, player } }: Props) {
    if (player.direction) {
      this.setState({
        direction: player.direction,
        animate: true,
      })
    } else if (controls.move) {
      this.setState({
        direction: controls.move,
        animate: false,
        flipX: false,
      })
    } else {
      this.setState({
        animate: false,
        flipX: false,
      })
    }
  }

  handleLoop = () => {
    this.setState({
      flipX: !this.state.flipX,
    })
  }

  render() {
    const { direction, animate, flipX } = this.state

    return (animate ? (
      <Transition
        from={new Point(0)}
        to={new Point(MOVE_TICKS - 1)}
        loop
        onLoop={this.handleLoop}
        render={({ x }) => {
          return (
            <Sprite
              {...spriteBaseProps}
              {...getPlayerSpriteProps(
                direction,
                Math.round(MOVE_DISTANCE * (x / (MOVE_TICKS - 1))),
                flipX,
              )}
            />
          )
        }}
      />
    ) : (
      <Sprite {...spriteBaseProps} {...getPlayerSpriteProps(direction, 0)} />
    )) as ReactNode
  }
}

export const Player = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerComponent)
