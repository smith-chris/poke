import { Application } from 'pixi.js'
import { palette } from 'styles/palette'
import styles from './app.sass'
import 'assets/fonts/fonts'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const isSafari =
  /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

export const DEBUG_MAP = false
export const DEBUG_MAP_BOUNDS = true
export const DEBUG_OFFSET = 30

const SCREEN_SIZE_FACTOR = DEBUG_MAP ? 1312 : 144

const App = new Application(SCREEN_SIZE_FACTOR, SCREEN_SIZE_FACTOR, {
  backgroundColor: palette.red,
  antialias: false,
  roundPixels: true,
})
const appElement = document.querySelector('#app')

export const viewport = !DEBUG_MAP_BOUNDS
  ? App.renderer.screen
  : {
      get width() {
        return App.renderer.screen.width - DEBUG_OFFSET * 2
      },
      get height() {
        return App.renderer.screen.height - DEBUG_OFFSET * 2
      },
    }

const getClosestMultiplication = (base: number, max: number) =>
  ((max - (max % base)) / base + 1) * base

if (!appElement) {
  console.warn('App element not found..')
} else {
  const canvasElement = App.view
  appElement.classList.add(styles.app)
  canvasElement.classList.add(styles.canvas)
  appElement.appendChild(canvasElement)

  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    let rendererWidth = SCREEN_SIZE_FACTOR
    let rendererHeight = SCREEN_SIZE_FACTOR
    if (width > height) {
      rendererWidth = SCREEN_SIZE_FACTOR * (width / height)
    } else if (height > width) {
      rendererHeight = SCREEN_SIZE_FACTOR * (height / width)
    }
    canvasElement.style.width = `${width}px`
    canvasElement.style.height = `${height}px`

    const multiplier = !isSafari
      ? 1
      : getClosestMultiplication(SCREEN_SIZE_FACTOR, Math.min(width, height))

    App.renderer.resize(rendererWidth * multiplier, rendererHeight * multiplier)
    if (isSafari) {
      App.stage.scale.set(multiplier)
    }
  }
  resize()

  window.addEventListener('resize', resize)
}

export const stage = App.stage
export const ticker = App.ticker
