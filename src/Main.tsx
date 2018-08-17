import React from 'react'
import { Game } from 'components/Game'
import { stage } from 'app/app'
import { store, actions } from 'store/store'
import { render } from 'react-pixi-fiber'
import { Provider } from 'react-redux'
import { mapsData } from 'assets/maps'
import { tilesetData } from 'assets/tilesets'
import 'keyboard'

actions.initialise({
  maps: mapsData,
  tilesets: tilesetData,
})

actions.loadMap('palletTown')

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage,
)
