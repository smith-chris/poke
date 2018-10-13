import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { particles } from 'pixi.js'

import { PixiComponent } from 'utils/fiber'
import { gameActions } from 'store/game'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

const MapComponent = PixiComponent<Props, particles.ParticleContainer>('Map2', {
  create: () => new particles.ParticleContainer(),
  applyProps: (container, oldProps, newProps) => {
    // console.log(newProps)
  },
})

const MapWrapper = (props: Props) => <MapComponent {...props} />

export const Map2 = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapWrapper)
