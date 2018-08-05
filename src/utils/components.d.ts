import { StatelessComponent } from 'react'
import { BitmapTextProperties } from 'react-pixi-fiber'

type Props = BitmapTextProperties & {
  pointerdown?: () => void
  color?: number
}

export const BitmapText: StatelessComponent<Props>
