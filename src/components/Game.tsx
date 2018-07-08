import React, { Component, ReactNode } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions } from 'store/game'
import { Point } from 'utils/point'
import { store } from 'store/store'
import { BitmapText } from 'utils/components'
import RandomGenerator from 'utils/RandomGenerator'
import { Map } from './Map'
import { palletTown } from 'assets/maps'
import { Player } from './Player'
import { Transition } from './Transition'

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
        <Transition
          from={0}
          to={-96}
          speed={0.5}
          render={y => (
            <Container position={new Point(32, y)}>
              <Map map={palletTown} />
            </Container>
          )}
        />
        <Player />
      </>
    ) as ReactNode
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
