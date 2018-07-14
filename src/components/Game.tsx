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

const MAP_CENTER = {
  x: 64,
  y: 64,
}

const getMapPosition = (player: Point) =>
  new Point(MAP_CENTER.x - player.x * 16, MAP_CENTER.y - player.y * 16)

class Game extends Component<Props> {
  handleMapTransitionFinish = () => {
    this.props.moveEnd()
  }
  render() {
    const {
      game: { player },
      moveEnd,
    } = this.props
    return (
      <>
        {player.destination ? (
          <Transition
            from={getMapPosition(player.position)}
            to={getMapPosition(player.destination)}
            speed={0.5}
            onFinish={moveEnd}
            render={position => (
              <Container position={position}>
                <Map map={palletTown} />
              </Container>
            )}
          />
        ) : (
          <Container position={getMapPosition(player.position)}>
            <Map map={palletTown} />
          </Container>
        )}
        <Player />
      </>
    ) as ReactNode
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
