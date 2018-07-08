import _overworldBlockset from 'gfx/blocksets/overworld.bst'
import _cemeteryBlockset from 'gfx/blocksets/cemetery.bst'
import { parseHexData } from './utils'
import { ObjectOf } from 'utils/types'

const BLOCKSETS: ObjectOf<ReturnType<typeof parseHexData>> = {
  OVERWORLD: parseHexData(_overworldBlockset),
  CEMETERY: parseHexData(_cemeteryBlockset),
}

export const getTextureLocationHexes = (hex: number, blocksetName?: string) => {
  const startByte = hex * 16
  return ((blocksetName && BLOCKSETS[blocksetName]) || BLOCKSETS.OVERWORLD).slice(
    startByte,
    startByte + 16,
  )
}
