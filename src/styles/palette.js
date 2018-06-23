import mapValues from 'lodash.mapvalues'
import _palette from '!!sass-variable-loader!./palette.sass'

export const palette = mapValues(_palette, color =>
  parseInt(color.replace('#', ''), 16),
)
