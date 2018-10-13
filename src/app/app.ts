import { Application } from 'pixi.js'
import { palette } from 'styles/palette'
import styles from './app.sass'
import 'assets/fonts/fonts'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const isSafari =
  /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

export const DEBUG_MAP = false

export const SCREEN_SIZE = DEBUG_MAP ? 1312 : 288
const App = new Application(SCREEN_SIZE, SCREEN_SIZE, {
  backgroundColor: palette.black,
  antialias: false,
  roundPixels: true,
})
const appElement = document.querySelector('#app')
const canvasHolderElement = appElement && appElement.querySelector('div')

const getClosestMultiplication = (base: number, max: number) =>
  ((max - (max % base)) / base + 1) * base

if (!appElement) {
  console.warn('App element not found..')
} else if (!canvasHolderElement) {
  console.warn('Canvas not found..')
} else {
  const canvasElement = App.view
  appElement.classList.add(styles.app)
  canvasHolderElement.classList.add(styles.canvasHolder)
  canvasElement.classList.add(styles.canvas)
  canvasHolderElement.appendChild(App.view)

  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const smaller = Math.min(width, height)
    canvasHolderElement.style.width = `${smaller}px`
    canvasHolderElement.style.height = `${smaller}px`
    if (isSafari) {
      let canvasSize
      canvasSize = getClosestMultiplication(SCREEN_SIZE, canvasElement.offsetWidth)
      App.renderer.resize(canvasSize, canvasSize)
      App.stage.scale.set(canvasSize / SCREEN_SIZE)
    }
  }
  resize()

  window.addEventListener('resize', resize)
}

export const stage = App.stage
export const ticker = App.ticker
