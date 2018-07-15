import React, { Component, ReactNode } from 'react'
import { Container, Sprite } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, Direction } from 'store/game'
import { Point } from 'utils/point'
import { store } from 'store/store'
import { BitmapText } from 'utils/components'
import RandomGenerator from 'utils/RandomGenerator'
import { getMap } from './Map'
import { palletTown } from 'assets/maps'
import { Player } from './Player'
import { Transition } from './Transition'
import { getNextPosition } from 'store/gameTransforms/move'

// WIP: The map name should be stored in redux
export const CURRENT_MAP = palletTown

export const canMove = (position: Point, direction: Direction) => {
  const { x, y } = getNextPosition(direction, position)
  return Boolean(CURRENT_MAP.collisions[`${x}_${y}`])
}

const MAP_COMPONENT = getMap(palletTown)

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
            speed={1}
            onFinish={moveEnd}
            render={position => (
              <Container position={position}>{MAP_COMPONENT}</Container>
            )}
          />
        ) : (
          <Container position={getMapPosition(player.position)}>
            {MAP_COMPONENT}
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
