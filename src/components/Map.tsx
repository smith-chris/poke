import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, wannaMove } from 'store/game'
import { Point } from 'utils/point'
import { Transition } from 'utils/withTransition'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE } from 'app/app'
import { createPointStepper } from 'utils/transition'
import { Sprite, Container } from 'utils/fiber'
import { TILESETS, OVERWORLD } from 'assets/tilesets'
import { Flower } from './Flower'
import { Water } from './Water'
import { Rectangle } from 'pixi.js'

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

// tslint:disable-next-line
const mapRectangle = <T extends any>(
  rect: Rectangle,
  f: (x: number, y: number) => T,
) => {
  const results: T[] = []
  for (let x = rect.x; x <= rect.width + rect.x; x++) {
    for (let y = rect.y; y <= rect.height + rect.y; y++) {
      results.push(f(x, y))
    }
  }
  return results
}

const makeMap = (tilesetName: string, textureIds: number[][], slice: Rectangle) =>
  mapRectangle(slice, (x, y) => {
    let textureId = textureIds[x] ? textureIds[x][y] : undefined
    const isOverworld = tilesetName === OVERWORLD
    if (!textureId) {
      if (isOverworld) {
        textureId = 82
      } else {
        return null
      }
    }
    const componentProps = {
      key: `${x}x${y}`,
      position: new Point(x * 8, y * 8),
    }

    if (isOverworld) {
      switch (textureId) {
        case 3:
          return <Flower {...componentProps} />
        case 20:
          return <Water {...componentProps} />
        default:
          break
      }
    }
    return (
      <Sprite
        {...componentProps}
        texture={TILESETS[tilesetName].cutTexture(
          (textureId % 16) * 8,
          Math.floor(textureId / 16) * 8,
          8,
          8,
        )}
      />
    )
  })

const SLICE_SIZE = SCREEN_SIZE / 8 + 4

type State = { map: ReturnType<typeof makeMap> }

class MapComponent extends Component<Props, State> {
  state = {
    map: [],
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
  setMap = ({ game: { currentMap, player, maps } }: Props) => {
    if (currentMap) {
      this.setState({
        map: makeMap(
          maps[currentMap.name].tilesetName,
          currentMap.textureIds,
          new Rectangle(
            player.position.x * 2 + 1 - SLICE_SIZE / 2,
            player.position.y * 2 + 1 - SLICE_SIZE / 2,
            SLICE_SIZE - 1,
            SLICE_SIZE - 1,
          ),
        ),
      })
    }
  }
  componentWillMount() {
    this.setMap(this.props)
  }
  componentWillReceiveProps(newProps: Props) {
    const {
      game: { currentMap, player },
    } = newProps
    if (currentMap && this.props.game.player.position !== player.position) {
      this.setMap(newProps)
    }
  }
  handleAnimationFinish = () => {
    const { moveStart, moveContinue, moveEnd, loadMap, game } = this.props
    if (
      game.controls.move &&
      wannaMove(game, { moveStart, moveContinue, moveEnd, loadMap })
    ) {
      return
    }
    moveEnd()
  }
  render() {
    const {
      game: { player },
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
      : undefined

    return (
      <Transition
        stepper={stepper}
        useTicks
        onFinish={this.handleAnimationFinish}
        render={(position = getMapPosition(player.position)) => (
          <Container position={position}>{map}</Container>
        )}
      />
    )
  }
}

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapComponent)
