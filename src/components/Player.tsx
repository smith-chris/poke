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

// Figure out later why the fuck importing it from 'store/game' breaks the build
export enum Direction {
  N = 'N',
  E = 'E',
  W = 'W',
  S = 'S',
}

const baseTexture = Texture.fromImage(red.src).baseTexture
const [redS, redN, redW] = [0, 16, 32].map(y => {
  const result = new Texture(baseTexture)
  result.frame = new Rectangle(0, y, 16, 16)
  return result
})

const getPlayerSpriteProps = (direction: Direction) => {
  switch (direction) {
    case Direction.N:
      return { texture: redN }
    case Direction.E:
      return { texture: redW, scale: new Point(-1, 1) }
    case Direction.W:
      return { texture: redW }
    case Direction.S:
      return { texture: redS }
    default:
      return assertNever(direction)
  }
}

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

const defaultState = {
  direction: Direction.S,
}

class PlayerComponent extends Component<Props, typeof defaultState> {
  state = defaultState
  componentWillReceiveProps({ game: { controls } }: Props) {
    if (controls.move) {
      this.setState({
        direction: controls.move,
      })
    }
  }

  render() {
    const { direction } = this.state
    return (
      <>
        <Sprite
          position={new Point(64 + 8, 64 + 8)}
          anchor={new Point(0.5, 0.5)}
          scale={new Point(1, 1)}
          {...getPlayerSpriteProps(direction)}
        />
      </>
    ) as ReactNode
  }
}

export const Player = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerComponent)
