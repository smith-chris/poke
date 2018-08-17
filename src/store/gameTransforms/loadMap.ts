import { GameState } from 'store/game'
import { parseHexData } from 'assets/utils'
import { makeGetBlockTextureIds } from 'assets/blocksets'

const fixedArray = <T>(x: number, y: number) => {
  // TODO: make it sealed
  const result: Array<Array<T>> = []
  for (let i = 0; i < x; i++) {
    result[i] = []
  }
  return result
}

export const loadMapTransform = (state: GameState, mapName: string) => {
  const map = state.maps[mapName]
  if (!map) {
    console.warn(
      `Map "${mapName}" is not one of available maps`,
      Object.keys(state.maps),
    )
    return
  }
  const tileset = state.tilesets[map.tilesetName]
  if (!tileset) {
    console.warn(
      `Tileset "${map.tilesetName}" is not one of available tilesets`,
      Object.keys(state.tilesets),
    )
    return
  }
  const getBlockTextureIds = makeGetBlockTextureIds(tileset.blockset)
  const blockIds = parseHexData(map.blocksData)
  const collisions = parseHexData(tileset.collisions)

  let parsedCollisions = fixedArray<boolean>(map.size.width * 2, map.size.height * 2)
  let parsedTextureIds = fixedArray<number>(map.size.width * 4, map.size.height * 4)

  blockIds.forEach((blockId, i) => {
    const x = i % map.size.width
    const y = Math.floor(i / map.size.width)
    const textureIds = getBlockTextureIds(blockId)

    // Each block has 4x4 textures
    const textureBaseX = x * 4
    const textureBaseY = y * 4
    textureIds.forEach((textureId, j) => {
      const textureX = textureBaseX + (j % 4)
      const textureY = textureBaseY + Math.floor(j / 4)
      parsedTextureIds[textureX][textureY] = textureId
    })

    // Each block has 2x2 collisions
    const baseX = x * 2
    const baseY = y * 2
    parsedCollisions[baseX][baseY] = collisions.includes(textureIds[4])
    parsedCollisions[baseX + 1][baseY] = collisions.includes(textureIds[6])
    parsedCollisions[baseX][baseY + 1] = collisions.includes(textureIds[12])
    parsedCollisions[baseX + 1][baseY + 1] = collisions.includes(textureIds[14])
  })
  return {
    textureIds: parsedTextureIds,
    collisions: parsedCollisions,
  }
}

export type LoadedMap = ReturnType<typeof loadMapTransform>
