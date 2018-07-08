import React, { Component, ReactNode } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions } from 'store/game'
import { store } from 'store/store'
import { Texture, Rectangle } from 'pixi.js'
import red from 'gfx/sprites/red.png'
import { Point } from 'utils/pixi'

const redTexture = Texture.fromImage(red.src)
redTexture.frame = new Rectangle(0, 0, 16, 16)

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class PlayerComponent extends Component<Props> {
  render() {
    return (
      <>
        <Sprite texture={redTexture} position={new Point(64, 64)} />
      </>
    ) as ReactNode
  }
}

export const Player = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerComponent)
