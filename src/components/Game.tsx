import React, { Component, Fragment } from 'react'
import { Container } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, Direction } from 'store/game'
import { Point } from 'utils/point'
import { Sprite } from 'utils/fiber'
import { getMap } from './getMap'
import { palletTown } from 'assets/maps'
import { Player } from './Player'
import { getNextPosition } from 'store/gameTransforms/move'
import { Transition } from './Transition'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE } from 'app/app'
import { createPointStepper } from 'utils/transition'
import { loop } from 'utils/render'
import { TILESETS } from 'assets/tilesets'
import { Rectangle } from './Rectangle'

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
      game: { player, currentMap },
      moveEnd,
    } = this.props

    if (!(currentMap && currentMap.textureIds)) {
      return
    }

    // const stepper = player.destination
    //   ? createPointStepper({
    //       from: getMapPosition(player.position),
    //       to: getMapPosition(player.destination),
    //       duration: TILE_SIZE,
    //     })
    //   : { data: getMapPosition(player.position) }

    return (
      <>
        {loop(16, 16, (x, y) => {
          const textureId = currentMap.textureIds[x][y]
          const r = x % 2 === 0 && y % 2 === 0
          let collision
          if (r) {
            collision = currentMap.collisions[x / 2][y / 2]
          }

          return (
            <Fragment key={`${x}x${y}`}>
              {r && (
                <Rectangle
                  position={new Point(x * 8, y * 8)}
                  width={16}
                  height={16}
                  color={collision ? 'red' : 'blue'}
                />
              )}
              <Sprite
                position={new Point(x * 8, y * 8)}
                texture={TILESETS.OVERWORLD.cutTexture(
                  (textureId % 16) * 8,
                  Math.floor(textureId / 16) * 8,
                  8,
                  8,
                )}
                alpha={0.5}
              />
            </Fragment>
          )
        })}
        {/* <Transition
          stepper={stepper}
          useTicks
          onFinish={moveEnd}
          render={position => (
            <Container position={position}>{MAP_COMPONENT}</Container>
          )}
        />
        <Player /> */}
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
