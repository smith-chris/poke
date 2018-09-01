import React from 'react'
import { stage } from 'app/app'
import { store, actions } from 'store/store'
import { render } from '@inlet/react-pixi'
import { Provider } from 'react-redux'
import { mapsData } from 'assets/maps'
import { tilesetsData } from 'assets/tilesets'
import { Game } from 'components/Game'
import 'subscribers/mapObject'
import 'keyboard'

actions.initialise({
  maps: mapsData,
  tilesets: tilesetsData,
})

// actions.loadMap({ mapName: 'CERULEAN_CITY' })
actions.loadMap({ mapName: 'PALLET_TOWN' })
// actions.loadMap({ mapName: 'VIRIDIAN_CITY' })
// actions.loadMap({ mapName: 'PEWTER_CITY' })
// actions.loadMap({ mapName: 'SAFFRON_CITY' })
// actions.loadMap({ mapName: 'ROUTE_1' })
// actions.loadMap({ mapName: 'ROUTE_2' })
// actions.loadMap({ mapName: 'ROUTE_4' })
// actions.loadMap({ mapName: 'ROUTE_5' })
// actions.loadMap({ mapName: 'ROUTE_9' })
// actions.loadMap({ mapName: 'ROUTE_22' })
// actions.loadMap({ mapName: 'ROUTE_24' })
// actions.loadMap({ mapName: 'ROUTE_25' })

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage,
)
