import _overworldBlockset from 'gfx/blocksets/overworld.bst'
import _cemeteryBlockset from 'gfx/blocksets/cemetery.bst'
import { parseHexData } from './utils'
import { ObjectOf } from 'utils/types'

export const makeGetBlockTextureIds = (blockset: string) => {
  const parsedBlockset = parseHexData(blockset)
  return (hex: number) => {
    const startByte = hex * 16
    return parsedBlockset.slice(startByte, startByte + 16)
  }
}

export const blocksetData = {
  overworld: _overworldBlockset,
  cemetery: _cemeteryBlockset,
}
export type BlocksetsData = ObjectOf<string>
