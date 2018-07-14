import { StatelessComponent } from 'react'
import { Point } from './point'
import { BitmapTextProperties } from 'react-pixi-fiber'
import { palette } from 'styles/palette'

type Props = BitmapTextProperties & {
  pointerdown?: () => void
  color?: keyof typeof palette
}

export const BitmapText: StatelessComponent<Props>
