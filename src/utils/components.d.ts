import { StatelessComponent } from 'react'
import { BitmapTextProperties } from '@inlet/react-pixi'
import { palette } from 'styles/palette'

type Props = BitmapTextProperties & {
  pointerdown?: () => void
  color?: keyof typeof palette
}

export const BitmapText: StatelessComponent<Props>
