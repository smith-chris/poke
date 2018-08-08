import React, { Component } from 'react'
import { Container } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, Direction } from 'store/game'
import { Point } from 'utils/point'
import { getMap } from './getMap'
import { palletTown } from 'assets/maps'
import { Player } from './Player'
import { Transition } from './Transition'
import { getNextPosition } from 'store/gameTransforms/move'
import { Transition2 } from './Transition2'
import { ticker } from 'app/app'
import { TILE_SIZE } from 'assets/const'

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

const MOVE_SPEED = 1
export const MOVE_DISTANCE = TILE_SIZE
export const MOVE_TICKS = Math.round(MOVE_DISTANCE / MOVE_SPEED)

const MAP_CENTER = {
  x: 64,
  y: 64,
}

const getMapPosition = (player: Point) =>
  new Point(MAP_CENTER.x - player.x * 16, MAP_CENTER.y - player.y * 16)

type CreatePointStepperParams = {
  from: Point
  to: Point
  duration: number
}

const createPointStepper = ({ from, to, duration }: CreatePointStepperParams) => {
  const diffX = from.x - to.x
  const diffY = from.y - to.y
  return (elapsed: number) => {
    const progress = elapsed / duration
    return {
      data: new Point(from.x - diffX * progress, from.y - diffY * progress),
      done: elapsed >= duration,
    }
  }
}

class Game extends Component<Props> {
  shouldComponentUpdate({
    game: {
      player: { position: newPosition, destination: newDestination },
    },
  }: Props) {
    const {
      game: {
        player: { position, destination },
      },
    } = this.props
    return position !== newPosition || destination !== newDestination
  }
  render() {
    const {
      game: { player },
      moveEnd,
    } = this.props
    return (
      <>
        <Transition2
          stepper={createPointStepper({
            from: getMapPosition(player.position),
            to: getMapPosition(player.destination || player.position),
            duration: TILE_SIZE,
          })}
          useTicks
          onFinish={moveEnd}
          render={position => (
            <Container position={position}>{MAP_COMPONENT}</Container>
          )}
        />
        <Player />
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
