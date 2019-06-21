import { Texture, Rectangle } from 'pixi.js'
import { assertNever } from 'utils/assertNever'
import { Point } from 'utils/point'
import { Direction } from 'store/game'
import red from 'gfx/sprites/red.png'

const baseTexture = Texture.fromImage(red.src).baseTexture
const [texS, texS2, texN, texN2, texW, texW2] = [0, 48, 16, 64, 32, 80].map(y => {
  const result = new Texture(baseTexture)
  result.frame = new Rectangle(0, y, 16, 16)
  return result
})

const choosePlayerTexture = (altTexture: boolean, tex: Texture, tex2: Texture) =>
  altTexture ? tex2 : tex

export const getPlayerSpriteProps = (
  direction: Direction,
  altTexture: boolean,
  flipX?: boolean,
) => {
  const scale = flipX ? new Point(-1, 1) : new Point(1, 1)
  switch (direction) {
    case Direction.N:
      return { texture: choosePlayerTexture(altTexture, texN, texN2), scale }
    case Direction.E:
      return {
        texture: choosePlayerTexture(altTexture, texW, texW2),
        scale: new Point(-1, 1),
      }
    case Direction.W:
      return { texture: choosePlayerTexture(altTexture, texW, texW2) }
    case Direction.S:
      return { texture: choosePlayerTexture(altTexture, texS, texS2), scale }
    default:
      return assertNever(direction)
  }
}
