import React, { Component } from 'react'
import { Sprite } from 'utils/fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions, Direction } from 'store/game'
import { Point } from 'utils/point'
import { Transition } from 'utils/withTransition'
import { makeStepper } from 'utils/transition'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE } from 'app/app'
import { getPlayerSpriteProps } from './getPlayerTexture'
import { shallowDiff } from 'utils/other'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

const defaultState = {
  direction: Direction.S,
  animate: false,
  flipX: false,
}

const playerBaseProps = {
  position: new Point(SCREEN_SIZE / 2, SCREEN_SIZE / 2),
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

  shouldComponentUpdate(_: Props, newState: State) {
    return shallowDiff(this.state, newState)
  }

  handleLoop = () => {
    this.setState({
      flipX: !this.state.flipX,
    })
  }

  render() {
    const { animate, direction, flipX } = this.state

    return (
      <Transition
        stepper={animate ? this.stepper : undefined}
        useTicks
        loop
        onLoop={this.handleLoop}
        render={(altTexture = false) => (
          <Sprite
            {...playerBaseProps}
            {...getPlayerSpriteProps(direction, altTexture, flipX)}
          />
        )}
      />
    )
  }
}

export const Player = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerComponent)
