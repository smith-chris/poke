import React, { Component } from 'react'
import { Container } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, Direction } from 'store/game'
import { Point } from 'utils/point'
import { getMap } from './getMap'
import { palletTown } from 'assets/maps'
import { getNextPosition } from 'store/gameTransforms/move'
import { Transition } from './Transition'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE } from 'app/app'
import { createPointStepper } from 'utils/transition'

// WIP: The map name should be stored in redux
export const CURRENT_MAP = palletTown

export const canMove = (position: Point, direction: Direction) => {
  const { x, y } = getNextPosition(direction, position)
  return Boolean(CURRENT_MAP.collisions[`${x}_${y}`])
}

const MAP_COMPONENT = getMap(CURRENT_MAP)

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

export const MOVE_DISTANCE = TILE_SIZE

const MAP_CENTER = {
  x: SCREEN_SIZE / 2 - TILE_SIZE / 2,
  y: SCREEN_SIZE / 2 - TILE_SIZE / 2,
}

const getMapPosition = (player: Point) =>
  new Point(MAP_CENTER.x - player.x * 16, MAP_CENTER.y - player.y * 16)

class MapComponent extends Component<Props> {
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
      game: { player, currentMap },
      moveEnd,
    } = this.props

    if (!(currentMap && currentMap.textureIds)) {
      return
    }

    const stepper = player.destination
      ? createPointStepper({
          from: getMapPosition(player.position),
          to: getMapPosition(player.destination),
          duration: TILE_SIZE,
        })
      : { data: getMapPosition(player.position) }

    return (
      <Transition
        stepper={stepper}
        useTicks
        onFinish={moveEnd}
        render={position => <Container position={position}>{MAP_COMPONENT}</Container>}
      />
    )
  }
}

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapComponent)
