import _overworldBlockset from 'gfx/blocksets/overworld.bst'
import { parseHexData } from './utils'

const overworldBlockset = parseHexData(_overworldBlockset)

export const getTextureLocationHexes = (hex: number) => {
  const startByte = hex * 16
  return overworldBlockset.slice(startByte, startByte + 16)
}
