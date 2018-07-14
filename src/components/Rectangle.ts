import { CustomPIXIComponent } from 'react-pixi-fiber'
import { Graphics, Container } from 'pixi.js'
import { Point } from 'utils/point'
import { palette } from 'styles/palette'

type Rect = {
  x?: number
  y?: number
  width: number
  height: number
}

const rectsEqual = (rA: Rect, rB: Rect) =>
  rA.x === rB.x && rA.y === rB.y && rA.width === rB.width && rA.height === rB.height

type Props = {
  position?: Point
  anchor?: number
  color?: keyof typeof palette
  width: number
  height: number
  x?: number
  y?: number
  alpha?: number
}

const applyProps = (graphics: Graphics, { position }: Props) => {
  if (position) {
    graphics.position = position
  }
}

const behavior = {
  customDisplayObject: (props: Props) => {
    const container = new Graphics()
    applyProps(container, props)
    return container
  },
  customApplyProps: (instance: Graphics, prev: Props, next: Props) => {
    applyProps(instance, next)
    if (
      !rectsEqual(prev, next) ||
      prev.color !== next.color ||
      prev.alpha !== next.alpha
    ) {
      const { color, alpha, anchor = 0, x, y, width, height } = next
      instance.clear()
      instance.beginFill(palette[color ? color : 'black'], alpha)
      instance.drawRect(
        (x || 0) - width * anchor,
        (y || 0) - height * anchor,
        width,
        height,
      )
      instance.endFill()
    }
  },
}
export const Rectangle = CustomPIXIComponent<Props, Container>(behavior, 'Rectangle')
