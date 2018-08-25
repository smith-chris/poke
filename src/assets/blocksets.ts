import { parseHexData } from './utils'
import { ObjectOf } from 'utils/types'
import overworldBlockset from 'gfx/blocksets/overworld.bst'
import redsHouseBlockset from 'gfx/blocksets/reds_house.bst'

export const makeGetBlockTextureIds = (blockset: string) => {
  const parsedBlockset = parseHexData(blockset)
  return (hex: number) => {
    const startByte = hex * 16
    return parsedBlockset.slice(startByte, startByte + 16)
  }
}

export const blocksetData = {
  overworld: overworldBlockset,
  redsHouse: redsHouseBlockset,
}
export type BlocksetsData = ObjectOf<string>
