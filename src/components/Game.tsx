import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { gameActions } from 'store/game'
import { Player } from './Player'
import { Map } from './Map'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

class Game extends Component<Props> {
  render() {
    return (
      <>
        <Map />
        <Player />
      </>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game)
