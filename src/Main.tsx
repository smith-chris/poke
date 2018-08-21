import React from 'react'
import { Game } from 'components/Game'
import { stage } from 'app/app'
import { store, actions } from 'store/store'
import { render } from '@inlet/react-pixi'
import { Provider } from 'react-redux'
import { mapsData } from 'assets/maps'
import { tilesetsData } from 'assets/tilesets'
import 'keyboard'

actions.initialise({
  maps: mapsData,
  tilesets: tilesetsData,
})

actions.loadMap('palletTown')

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage,
)
