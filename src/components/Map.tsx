import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, Direction, GameState } from 'store/game'
import { Point } from 'utils/point'
import { getNextPosition } from 'store/gameTransforms/move'
import { Transition } from './Transition'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE } from 'app/app'
import { createPointStepper } from 'utils/transition'
import { Sprite, Container } from 'utils/fiber'
import { TILESETS } from 'assets/tilesets'
import { Flower } from './Flower'
import { Water } from './Water'

export const canMove = (
  position: Point,
  direction: Direction,
  collisions: boolean[][],
) => {
  const { x, y } = getNextPosition(direction, position)
  return collisions[x][y]
}

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

const makeMap = (game: GameState) => {
  if (!game.currentMap) {
    return null
  }

  const result: JSX.Element[] = []
  game.currentMap.textureIds.forEach((row, x) => {
    row.forEach((textureId, y) => {
      const componentProps = {
        key: `${x}x${y}`,
        position: new Point(x * 8, y * 8),
      }

      switch (textureId) {
        case 3:
          result.push(<Flower {...componentProps} />)
          break
        case 20:
          result.push(<Water {...componentProps} />)
          break
        default:
          result.push(
            <Sprite
              {...componentProps}
              texture={TILESETS.OVERWORLD.cutTexture(
                (textureId % 16) * 8,
                Math.floor(textureId / 16) * 8,
                8,
                8,
              )}
            />,
          )
      }
    })
  })
  return result
}

type State = { map: ReturnType<typeof makeMap> }

class MapComponent extends Component<Props, State> {
  state = {
    map: null,
  }
  shouldComponentUpdate(
    {
      game: {
        player: { position: newPosition, destination: newDestination },
      },
    }: Props,
    newState: State,
  ) {
    const {
      game: {
        player: { position, destination },
      },
    } = this.props
    return (
      position !== newPosition ||
      destination !== newDestination ||
      this.state !== newState
    )
  }
  componentWillMount() {
    this.setState({
      map: makeMap(this.props.game),
    })
  }
  componentWillReceiveProps({ game: newGame }: Props) {
    const { game } = this.props

    if (game.currentMap !== newGame.currentMap && newGame.currentMap) {
      this.setState({ map: makeMap(newGame) })
    }
  }
  render() {
    const {
      game: { player },
      moveEnd,
    } = this.props
    const { map } = this.state
    if (!map) {
      return null
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
        render={position => <Container position={position}>{map}</Container>}
      />
    )
  }
}

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapComponent)
