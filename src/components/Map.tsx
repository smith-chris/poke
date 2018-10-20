import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, wannaMove } from 'store/game'
import { Transition } from 'utils/withTransition'
import { TILE_SIZE } from 'assets/const'
import { viewport } from 'app/app'
import { createPointStepper } from 'utils/transition'
import { Container } from 'utils/fiber'
import { Rectangle } from 'pixi.js'
import { getMapPosition } from './mapUtils'
import { MapTiles } from './MapTiles'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

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
      const sliceWidth = viewport.width / 8 + 4
      const sliceHeight = viewport.height / 8 + 4
      this.setState({
        map: new Rectangle(
          Math.round(game.player.position.x * 2 + 1 - sliceWidth / 2),
          Math.round(game.player.position.y * 2 + 1 - sliceHeight / 2 - 1),
          Math.round(sliceWidth - 1),
          Math.round(sliceHeight - 1 + 1),
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
)(MapComponent)
