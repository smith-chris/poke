import React, { Component, ReactNode } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { uiActions } from 'store/ui'
import { Point } from 'utils/pixi'
import { store } from 'store/store'
import { BitmapText } from 'utils/components'
import RandomGenerator from 'utils/RandomGenerator'
import red from 'gfx/sprites/red.png'
import { Texture, Rectangle } from 'pixi.js'
import { Map } from './Map'
import { agatha } from 'assets/maps'

const redTexture = Texture.fromImage(red.src)
redTexture.frame = new Rectangle(0, 0, 16, 16)

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...uiActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Game extends Component<Props> {
  render() {
    const {
      ui: { round },
      increment,
      decrement,
    } = this.props
    return (
      <>
        <Map map={agatha} />
      </>
    ) as ReactNode
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
