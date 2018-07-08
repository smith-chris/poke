import React, { Component, ReactNode } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions } from 'store/game'
import { Point } from 'utils/pixi'
import { store } from 'store/store'
import { BitmapText } from 'utils/components'
import RandomGenerator from 'utils/RandomGenerator'
import { Map } from './Map'
import { palletTown } from 'assets/maps'
import { Player } from './Player'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Game extends Component<Props> {
  render() {
    const {
      game: {
        player: { position },
      },
    } = this.props
    return (
      <>
        <Container position={new Point(position.x, position.y)}>
          <Map map={palletTown} />
        </Container>
        <Player />
      </>
    ) as ReactNode
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
