import _overworldBlockset from 'gfx/blocksets/overworld.bst'
import _cemeteryBlockset from 'gfx/blocksets/cemetery.bst'
import { parseHexData } from './utils'
import { ObjectOf } from 'utils/types'

const BLOCKSETS: ObjectOf<ReturnType<typeof parseHexData>> = {
  OVERWORLD: parseHexData(_overworldBlockset),
  CEMETERY: parseHexData(_cemeteryBlockset),
}
// console.log(_overworldBlockset)

export const getTextureLocationHexes = (hex: number, blocksetName?: string) => {
  const startByte = hex * 16
  const result = (
    (blocksetName && BLOCKSETS[blocksetName]) ||
    BLOCKSETS.OVERWORLD
  ).slice(startByte, startByte + 16)
  // console.log('getTextureLocationHexes', hex, result)
  return result
}

export const makeGetBlockTextureIds = (blockset: string) => {
  const parsedBlockset = parseHexData(blockset)
  return (hex: number) => {
    const startByte = hex * 16
    const result = parsedBlockset.slice(startByte, startByte + 16)
    // console.log('getSegmentTextureLocationIds', hex, result)
    return result
  }
}

export const blocksetData = {
  overworld: _overworldBlockset,
  cemetery: _cemeteryBlockset,
}
export type BlocksetsData = ObjectOf<string>
