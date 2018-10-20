import { Graphics } from 'pixi.js'
import { PixiComponent } from '@inlet/react-pixi'

type Props = {
  x: number
  y: number
  height: number
  width: number
  fill?: number
  alpha?: number
}

export const Rect = PixiComponent<Props, Graphics>('Rectangle', {
  create: () => {
    return new Graphics()
  },
  applyProps: (instance, _, newProps) => {
    const { fill = 0xfff, alpha = 1, x, y, width, height } = newProps
    instance.clear()
    instance.beginFill(fill)
    instance.alpha = alpha
    instance.drawRect(x, y, width, height)
    instance.endFill()
  },
})
