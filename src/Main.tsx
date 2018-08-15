import React from 'react'
import { stage } from 'app/app'
import { store } from 'store/store'
import { render } from 'react-pixi-fiber'
import Game from 'components/Game'
import { Provider } from 'react-redux'
import 'keyboard'

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage,
)
