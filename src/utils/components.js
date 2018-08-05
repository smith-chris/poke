import React from 'react'
import { BitmapText as PixiBitmapText } from 'react-pixi-fiber'

export const BitmapText = ({ color, ...rest }) => {
  if (!rest.text) {
    console.warn('No text provided:', rest)
    return null
  }
  rest.text = rest.text.toString()
  const style = {
    font: '4px pico-bitmap-font',
    tint: color ? color : 0x000,
  }
  return <PixiBitmapText style={style} {...rest} />
}
