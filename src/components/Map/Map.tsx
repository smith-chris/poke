import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Direction } from 'store/gameTypes'
import { Transition } from 'components/withTransition/withTransition'
import { TILE_SIZE } from 'assets/const'
import { createPointStepper } from 'components/withTransition/transition'
import { Container } from 'utils/fiber'
import { Rectangle } from 'pixi.js'
import { getMapPosition } from './mapUtils'
import { MapTiles } from './MapTiles'
import { withViewport, ViewportProps } from '../withViewport'
import { getSlice } from './tileUtils'
import { moveIntent } from 'store/gameTransforms/moveIntent'
import { gameActionCreators } from 'store/gameStore'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActionCreators }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps & ViewportProps

type State = { map?: Rectangle }

class MapComponent extends Component<Props, State> {
  state = {
    map: new Rectangle(),
  }
  shouldComponentUpdate(
    {
      game: {
        player: { position: newPosition, destination: newDestination },
      },
      viewport: newViewport,
    }: Props,
    newState: State,
  ) {
    const {
      game: {
        player: { position, destination },
      },
      viewport,
    } = this.props
    return (
      position !== newPosition ||
      destination !== newDestination ||
      viewport !== newViewport ||
      this.state !== newState
    )
  }
  setMap = ({ game, viewport }: Props) => {
    if (game.currentMap.center) {
      const slice = getSlice(viewport, game.player.position)
      if (game.player.destination && game.player.direction) {
        switch (game.player.direction) {
          case Direction.N:
            slice.y -= 2
            slice.height += 2
            break
          case Direction.E:
            slice.width += 2
            break
          case Direction.W:
            slice.x -= 2
            slice.width += 2
            break
          case Direction.S:
            slice.height += 2
            break
          default:
            break
        }
      }
      this.setState({
        map: slice,
      })
    }
  }
  componentWillMount() {
    this.setMap(this.props)
  }
  componentWillReceiveProps(newProps: Props) {
    const {
      game: { currentMap, player },
      viewport,
    } = newProps

    const newDestination =
      player.destination && this.props.game.player.destination !== player.destination

    const newPosition =
      this.props.game.player.destination !== player.position &&
      this.props.game.player.position !== player.position

    if (
      (currentMap && (newDestination || newPosition)) ||
      this.props.viewport !== viewport
    ) {
      this.setMap(newProps)
    }
  }
  handleAnimationFinish = () => {
    const { moveStart, moveContinue, moveEnd, loadMap, game } = this.props
    if (
      game.controls.move &&
      moveIntent(game, { moveStart, moveContinue, moveEnd, loadMap })
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
        shouldUpdate={map}
        onFinish={this.handleAnimationFinish}
        render={(position = getMapPosition(player.position)) => (
          <Container position={position}>
            <MapTiles game={this.props.game} slice={map} />
          </Container>
        )}
      />
    )
  }
}

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withViewport(MapComponent))
