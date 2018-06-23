import React, { Component, ReactNode } from 'react'
import { Container } from 'react-pixi-fiber'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { uiActions } from 'store/ui'
import { Point } from 'utils/pixi'
import { store } from 'store/store'
import { BitmapText } from 'utils/components'
import RandomGenerator from 'utils/RandomGenerator'
import { Rectangle } from './Rectangle'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...uiActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Game extends Component<Props> {
  render() {
    const {
      ui: { round },
      increment,
      decrement,
    } = this.props
    return (
      <>
        <Container position={new Point(32, 32)}>
          <Rectangle width={64} height={64} color="blue" />
          <BitmapText
            color="white"
            text={`Round: ${round}`}
            position={new Point(32, 16)}
            anchor={0.5}
          />
          <BitmapText
            color="white"
            text="Increment"
            position={new Point(32, 32)}
            anchor={0.5}
            interactive
            pointerdown={increment}
          />
          <BitmapText
            color="white"
            text="Decrement"
            position={new Point(32, 48)}
            anchor={0.5}
            interactive
            pointerdown={decrement}
          />
        </Container>
      </>
    ) as ReactNode
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
