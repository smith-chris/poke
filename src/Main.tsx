import React from 'react'
import { Texture, Point } from 'pixi.js'
import { Provider } from 'react-redux'
import { store } from 'store/store'
import { stage } from 'app/app'
import { Sprite, render } from 'utils/fiber'
import bunny from 'assets/bunny.png'

const bunnyTexture = Texture.fromImage(bunny.src)

render(
  <Provider store={store}>
    <Sprite texture={bunnyTexture} anchor={0.5} position={new Point(64, 64)} />
  </Provider>,
  stage,
)
