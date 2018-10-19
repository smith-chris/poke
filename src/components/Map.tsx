import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, wannaMove, GameState, Direction, toDirection } from 'store/game'
import { Point } from 'utils/point'
import { Transition } from 'utils/withTransition'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE, DEBUG_MAP } from 'app/app'
import { createPointStepper } from 'utils/transition'
import { Sprite, Container } from 'utils/fiber'
import { TILESETS, OVERWORLD } from 'assets/tilesets'
import { Flower } from './Flower'
import { Water } from './Water'
import { Rectangle } from 'pixi.js'
import { makeGetTextureId, mapRectangle, getMapPosition } from './mapUtils'
import { MapBase } from './Map2'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

const makeMap = (game: GameState, slice: Rectangle) => {
  const { currentMap, maps } = game
  const { center } = currentMap
  if (!center) {
    console.warn('No current map!', currentMap)
    return null
  }
  const centerMap = maps[center.name]
  const getTextureInd = makeGetTextureId(game)
  if (!getTextureInd) {
    return
  }

  const isOverworld = centerMap.tilesetName === OVERWORLD

  return mapRectangle(slice, (x, y) => {
    let textureId = getTextureInd(x, y)
    if (!textureId) {
      if (DEBUG_MAP) {
        return null
      }
      if (isOverworld) {
        textureId = [82]
      } else {
        return null
      }
    }
    const componentProps = {
      key: `${x}x${y}`,
      position: new Point(x * 8, y * 8),
    }

    const [ID, isCenter] = textureId
    if (typeof ID !== 'number') {
      return null
    }
    if (isOverworld && !DEBUG_MAP) {
      switch (ID) {
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
        tint={isCenter && DEBUG_MAP ? 0xbbffaa : 0xffffff}
        texture={TILESETS[centerMap.tilesetName].cutTexture(
          (ID % 16) * 8,
          Math.floor(ID / 16) * 8,
          8,
          8,
        )}
      />
    )
  })
}

const SLICE_SIZE = SCREEN_SIZE / 8 + 4

type State = { map?: Rectangle }

class MapComponent extends Component<Props, State> {
  state = {
    map: undefined,
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
  setMap = ({ game }: Props) => {
    if (game.currentMap.center) {
      this.setState({
        map: new Rectangle(
          game.player.position.x * 2 + 1 - SLICE_SIZE / 2,
          game.player.position.y * 2 + 1 - SLICE_SIZE / 2 - 1,
          SLICE_SIZE - 1,
          SLICE_SIZE - 1 + 1,
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

    const stepper =
      player.destination !== undefined
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
          <Container position={position}>
            <MapBase game={this.props.game} slice={map} />
          </Container>
        )}
      />
    )
  }
}

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapComponent)
