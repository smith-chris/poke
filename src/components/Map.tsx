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
import { LoadedMap } from 'store/gameTransforms/loadMap'

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
  new Point(MAP_CENTER.x - player.x * 16, MAP_CENTER.y - player.y * 16 + 4)

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

let effort = 0
const makeGetTextureId = (game: GameState) => {
  const { currentMap, maps } = game
  const { center } = currentMap
  if (!center) {
    console.warn('No current map!', currentMap)
    return undefined
  }
  const centerMap = maps[center.name]
  if (!centerMap) {
    console.warn('No center map', center.name, maps)
    return undefined
  }

  const centerRect = new Rectangle(
    0,
    0,
    centerMap.size.width * 4,
    centerMap.size.height * 4,
  )

  // Could be using something like 'typedEntries' to get better typings
  const connectionsData = Object.entries(currentMap)
    .filter(
      ([key, value]) =>
        toDirection(key) !== undefined &&
        value !== undefined &&
        maps[value.name] !== undefined,
    )
    .map(([direction, { textureIds, name }]: [Direction, LoadedMap]) => ({
      direction,
      textureIds,
      width: maps[name].size.width * 4,
      height: maps[name].size.height * 4,
      offset: centerMap.connections[direction].offset * 4,
    }))

  const getConnectionTextureID = (x: number, y: number) => {
    for (const { direction, textureIds, width, height, offset } of connectionsData) {
      // Basically top left cornerd of rendered connection map
      let finalX, finalY
      switch (direction) {
        case Direction.N:
          if (y >= 0) {
            continue
          }
          finalX = x - offset
          finalY = y + height
          break
        case Direction.E:
          if (x < centerRect.right) {
            continue
          }
          finalX = x - centerRect.width
          finalY = y - offset
          break
        case Direction.W:
          if (x >= 0) {
            continue
          }
          finalX = x + width
          finalY = y - offset
          break
        case Direction.S:
          if (y < centerRect.bottom) {
            continue
          }
          finalX = x - offset
          finalY = y - centerRect.height
          break
        default:
          continue
      }

      const isOutsideMapWidth = finalX < 0 || finalX >= width
      const isOutsideMapHeight = finalY < 0 || finalY >= height
      if (!isOutsideMapWidth && !isOutsideMapHeight) {
        effort++
        return [textureIds[finalX] && textureIds[finalX][finalY], false]
      }
    }
    return undefined
  }

  return (x: number, y: number) => {
    const isInCenterMapWidth = x >= 0 && x < centerRect.right
    const isInCenterMapHeight = y >= 0 && y < centerRect.bottom

    if (isInCenterMapWidth && isInCenterMapHeight) {
      effort++
      return [center && center.textureIds[x] && center.textureIds[x][y], true]
    }

    return getConnectionTextureID(x, y)
  }
}

const makeMap = (game: GameState, slice: Rectangle) => {
  const { currentMap, maps } = game
  const { center } = currentMap
  if (!center) {
    console.warn('No current map!', currentMap)
    return null
  }
  effort = 0
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
  setMap = ({ game }: Props) => {
    if (game.currentMap.center) {
      this.setState({
        map: makeMap(
          game,
          new Rectangle(
            game.player.position.x * 2 + 1 - SLICE_SIZE / 2,
            game.player.position.y * 2 + 1 - SLICE_SIZE / 2 - 1,
            SLICE_SIZE - 1,
            SLICE_SIZE - 1 + 1,
          ),
        ),
      })
      // console.log('makeMap effort', effort)
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
