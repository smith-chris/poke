import React from 'react'
import { Text, BitmapText as PixiBitmapText } from 'react-pixi-fiber'
import { palette } from 'styles/palette'

export const BitmapText = ({ color, ...rest }) => {
  if (!rest.text) {
    console.warn('No text provided:', rest)
    return null
  }
  rest.text = rest.text.toString()
  const style = {
    font: '4px pico-bitmap-font',
    tint: palette[color ? color : 'black'],
  }
  return <PixiBitmapText style={style} {...rest} />
}
