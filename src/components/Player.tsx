import React, { Component } from 'react'
import { Sprite } from 'utils/fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEqual from 'lodash.isequal'
import { Direction } from 'store/gameTypes'
import { Point } from 'utils/point'
import { Transition } from 'utils/withTransition'
import { makeStepper } from 'utils/transition'
import { TILE_SIZE } from 'assets/const'
import { getPlayerSpriteProps } from './getPlayerTexture'
import { withViewport, ViewportProps } from './withViewport'
import { gameActionCreators } from 'store/gameStore'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActionCreators }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps & ViewportProps

const defaultState = {
  direction: Direction.S,
  animate: false,
  flipX: false,
}

const playerBaseProps = {
  anchor: new Point(0.5, 0.5),
  scale: new Point(1, 1),
}

type State = typeof defaultState

class PlayerComponent extends Component<Props, State> {
  state = defaultState

  stepper = makeStepper((tick: number) => ({
    data: tick >= 8,
    done: tick >= TILE_SIZE,
  }))

  componentWillReceiveProps({ game: { controls, player } }: Props) {
    if (player.direction && player.destination) {
      this.setState({
        direction: player.direction,
        animate: true,
      })
    } else if (controls.move) {
      this.setState({
        direction: controls.move,
        animate: false,
        flipX: false,
      })
    } else {
      this.setState({
        animate: false,
        flipX: false,
      })
    }
  }

  shouldComponentUpdate({ viewport: newViewport }: Props, newState: State) {
    return !isEqual(this.state, newState) || this.props.viewport !== newViewport
  }

  handleLoop = () => {
    this.setState({
      flipX: !this.state.flipX,
    })
  }

  render() {
    const { animate, direction, flipX } = this.state
    const { viewport } = this.props
    const position = new Point(
      Math.round(viewport.width / 2),
      Math.round(viewport.height / 2),
    )
    return (
      <Transition
        stepper={animate ? this.stepper : undefined}
        useTicks
        loop
        onLoop={this.handleLoop}
        render={(altTexture = false) => (
          <Sprite
            {...playerBaseProps}
            position={position}
            {...getPlayerSpriteProps(direction, altTexture, flipX)}
          />
        )}
      />
    )
  }
}

export const Player = withViewport(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PlayerComponent),
)
