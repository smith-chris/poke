import React, { Component } from 'react'
import { Sprite } from 'utils/fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions } from 'store/game'
import { Point } from 'utils/point'
import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE } from 'app/app'
import { withTransition, TransitionProps } from 'utils/withTransition'
import { makeStepper } from 'utils/transition'
import { getPlayerSpriteProps } from './getPlayerTexture'

// Figure out later why the fuck importing it from 'store/game' breaks the build
export enum Direction {
  N = 'N',
  E = 'E',
  W = 'W',
  S = 'S',
}

const defaultState = {
  direction: Direction.S,
  flipX: false,
}

const playerBaseProps = {
  position: new Point(SCREEN_SIZE / 2, SCREEN_SIZE / 2),
  anchor: new Point(0.5, 0.5),
  scale: new Point(1, 1),
}

const shallowDiff = <T extends {}>(a: T, b: T) => {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return true
    }
  }
  return false
}

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps & TransitionProps<boolean>

type State = typeof defaultState

const stepper = makeStepper((tick: number) => ({
  data: tick >= 8,
  done: tick >= TILE_SIZE,
}))

export const Player = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withTransition(stepper, {
    loop: true,
    useTicks: true,
    onLoop: ({ flipX = false }: { flipX?: boolean }) => ({ flipX: !flipX }),
  })(
    class extends Component<Props, State> {
      static displayName = 'Player'
      state = defaultState

      componentWillReceiveProps({ game: { controls, player }, transition }: Props) {
        if (player.direction) {
          this.setState({
            direction: player.direction,
          })
          transition.start()
        } else if (controls.move) {
          this.setState({
            direction: controls.move,
            flipX: false,
          })
          transition.reset()
        } else {
          this.setState({
            flipX: false,
          })
          transition.reset()
        }
      }

      shouldComponentUpdate(newProps: Props, newState: State) {
        return shallowDiff(this.state, newState) || this.props !== newProps
      }

      onLoop = () => {
        this.setState({
          flipX: !this.state.flipX,
        })
      }

      render() {
        const { direction, flipX } = this.state

        return (
          <Sprite
            {...playerBaseProps}
            {...getPlayerSpriteProps(direction, this.props.data, flipX)}
          />
        )
      }
    },
  ),
)
