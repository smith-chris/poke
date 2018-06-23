import { loader, BitmapText, loaders, Texture } from 'pixi.js'
import picoDefinition from './pico-bitmap-font.xml'
import picoImage from './pico-bitmap-font.png'

const picoTexture = Texture.fromImage(picoImage.src)
const picoXml = new DOMParser().parseFromString(picoDefinition, 'text/xml')

loaders.parseBitmapFontData({ data: picoXml }, picoTexture)
