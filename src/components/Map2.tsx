import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { particles, Rectangle, Sprite } from 'pixi.js'

import { PixiComponent } from 'utils/fiber'
import { gameActions } from 'store/game'
import { SCREEN_SIZE } from 'app/app'
import { makeMapIDs } from './mapUtils'
import { TILESETS } from 'assets/tilesets'

const mapStateToProps = (state: StoreState) => state
type StateProps = ReturnType<typeof mapStateToProps>

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ ...gameActions }, dispatch)
}
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type Props = StateProps & DispatchProps

const SLICE_SIZE = SCREEN_SIZE / 8 + 4

const getTexture = (tilesetName: string, id: number) =>
  TILESETS[tilesetName].cutTexture((id % 16) * 8, Math.floor(id / 16) * 8, 8, 8)

const MapComponent = PixiComponent<Props, particles.ParticleContainer>('Map2', {
  create: () => new particles.ParticleContainer(),
  applyProps: (container, oldProps, newProps) => {
    const { game } = newProps
    const { currentMap, player, maps } = game
    const oldPlayer = (oldProps.game && oldProps.game.player) || {}
    if (currentMap.center && player.position !== oldPlayer.position) {
      const mapRect = new Rectangle(
        player.position.x * 2 + 1 - SLICE_SIZE / 2,
        player.position.y * 2 + 1 - SLICE_SIZE / 2 - 1,
        SLICE_SIZE - 1,
        SLICE_SIZE - 1 + 1,
      )

      const mapIDs = makeMapIDs(game, mapRect)
      if (!mapIDs || mapIDs.length <= 0) {
        return
      }

      const { center } = currentMap
      if (!center) {
        console.warn('No current map!', currentMap)
        return null
      }
      const centerMap = maps[center.name]

      let i = 0
      const div = mapRect.width + 2
      for (const id of mapIDs) {
        const texture = getTexture(centerMap.tilesetName, id)
        const sprite = new Sprite(texture)
        const y = (i % div) * 8
        const x = Math.floor(i / div) * 8
        sprite.position.x = x
        sprite.position.y = y
        container.addChild(sprite)
        i++
      }
    }
  },
})

const MapWrapper = (props: Props) => <MapComponent {...props} />

export const Map2 = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapWrapper)
