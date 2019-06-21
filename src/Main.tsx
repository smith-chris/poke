import React from 'react'
import { stage } from 'app/app'
import { store, actions } from 'store/store'
import { render } from '@inlet/react-pixi'
import { Provider } from 'react-redux'
import { mapsData } from 'assets/maps'
import { tilesetsData } from 'assets/tilesets'
import { Game } from 'components/Game'
import 'subscribers/mapObject'
import 'handleInput'

actions.initialise({
  maps: mapsData,
  tilesets: tilesetsData,
})

actions.loadMap({ mapName: 'PALLET_TOWN' })

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage,
)
