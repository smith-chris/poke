import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, wannaMove, GameState } from 'store/game'
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

let effort = 0
const makeGetTextureId = (game: GameState) => {
  const { currentMap, maps } = game
  const { center, north, east, south, west } = currentMap
  if (!center) {
    console.warn('No current map!', currentMap)
    return undefined
  }
  const centerMap = maps[center.name]
  if (!centerMap) {
    console.warn('No center map', center.name, maps)
    return undefined
  }
  // This is all WIP
  const northMap = north ? maps[north.name] : undefined
  const eastMap = east ? maps[east.name] : undefined
  const westMap = west ? maps[west.name] : undefined
  const southMap = south ? maps[south.name] : undefined
  return (x: number, y: number) => {
    const centerRight = centerMap.size.width * 4
    const centerBottom = centerMap.size.height * 4

    const isInCenterMapWidth = x >= 0 && x < centerRight
    const isInCenterMapHeight = y >= 0 && y < centerBottom

    if (isInCenterMapWidth && isInCenterMapHeight) {
      effort++
      return center && center.textureIds[x] && center.textureIds[x][y]
    }

    const isNorth = isInCenterMapWidth && y < 0
    if (isNorth && northMap) {
      const offsetX = centerMap.connections.north.x * 4 || 0
      if (x < offsetX || x >= northMap.size.width * 4 + offsetX) {
        return
      }
      effort++
      return (
        north &&
        north.textureIds[x - offsetX] &&
        north.textureIds[x - offsetX][y + northMap.size.height * 4]
      )
    }

    const isEast = isInCenterMapHeight && x >= centerRight

    if (isEast && eastMap) {
      const eastX = x - centerMap.size.width * 4
      const offsetY = centerMap.connections.east.x * 4 || 0
      if (y < offsetY || y >= eastMap.size.height * 4 + offsetY) {
        return
      }
      effort++
      return east && east.textureIds[eastX] && east.textureIds[eastX][y - offsetY]
    }

    const isWest = isInCenterMapHeight && x < 0

    if (isWest && westMap) {
      const westX = x + westMap.size.width * 4
      const offsetY = centerMap.connections.west.x * 4 || 0
      if (y < offsetY || y >= westMap.size.height * 4 + offsetY) {
        return
      }
      effort++
      return west && west.textureIds[westX] && west.textureIds[westX][y - offsetY]
    }
    const isSouth = isInCenterMapWidth && y >= centerBottom

    if (isSouth && southMap) {
      const offsetX = centerMap.connections.south.x * 4 || 0
      if (x < offsetX || x >= southMap.size.width * 4 + offsetX) {
        return
      }
      effort++
      return (
        south &&
        south.textureIds[x - offsetX] &&
        south.textureIds[x - offsetX][y - centerMap.size.height * 4]
      )
    }
    return false
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

  return mapRectangle(slice, (x, y) => {
    let textureId = getTextureInd(x, y)
    const isOverworld = centerMap.tilesetName === OVERWORLD
    if (!textureId) {
      return null
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

    // if (isOverworld) {
    //   switch (textureId) {
    //     case 3:
    //       return <Flower {...componentProps} />
    //     case 20:
    //       return <Water {...componentProps} />
    //     default:
    //       break
    //   }
    // }
    return (
      <Sprite
        {...componentProps}
        texture={TILESETS[centerMap.tilesetName].cutTexture(
          (textureId % 16) * 8,
          Math.floor(textureId / 16) * 8,
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
            game.player.position.y * 2 + 1 - SLICE_SIZE / 2,
            SLICE_SIZE - 1,
            SLICE_SIZE - 1,
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
