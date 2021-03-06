import { parseHexData } from 'assets/utils'
import { makeGetBlockTextureIds } from 'assets/blocksets'
import { MapData } from 'assets/maps'
import { Point } from 'utils/point'
import { actions, store } from '../store'
import { DEBUG_MAP } from 'app/app'
import { moveIntent } from 'store/gameTransforms/moveIntent'
import { Direction, GameState, LoadMapData, LoadedMap } from 'store/gameTypes'

const fixedArray = <T>(x: number, y: number) => {
  // TODO: make it sealed
  const result: Array<Array<T>> = []
  for (let i = 0; i < x; i++) {
    result[i] = []
  }
  return result
}

export const loadMap = (
  state: GameState,
  { mapName, location, playerData, exit }: LoadMapData,
) => {
  const { maps } = state

  if (state.currentMap.center && !state.player.moved) {
    console.warn('Trying to load map while player has not moved!')
    return undefined
  }

  const map = maps[mapName]
  const centerMap = getMap(state, mapName)
  if (!map || !centerMap) {
    return undefined
  }
  const currentMap: Record<string, LoadedMap> = { center: centerMap }
  for (const key in map.connections) {
    const connectionMapName = map.connections[key]
    const connectionMap = getMap(state, connectionMapName.mapName)
    if (connectionMap) {
      currentMap[key] = connectionMap
    }
  }

  let player = {
    ...state.player,
    moved: false,
    // To be removed
    position: DEBUG_MAP
      ? new Point(map.size.width, map.size.height)
      : state.player.position,
  }
  if (playerData) {
    player = { ...player, ...playerData }
  } else if (location !== undefined) {
    const wrapPosition = getWarpPosition(map, location)
    if (wrapPosition) {
      if (exit) {
        player = {
          position: new Point(wrapPosition.x, wrapPosition.y),
          direction: Direction.S,
          moved: false,
        }
      } else {
        player = {
          ...player,
          position: wrapPosition,
        }
      }
    }
  }

  if (state.controls.move !== undefined && !playerData) {
    // Super dirty hack :/
    setTimeout(() => {
      moveIntent(store.getState().game, actions)
    })
  }

  return {
    player,
    currentMap,
  }
}

const getMap = (state: GameState, mapName: string) => {
  // To be optimisied (memoized)
  const { maps, tilesets } = state
  const map = maps[mapName]
  if (!map) {
    console.warn(`Map "${mapName}" is not one of available maps`, Object.keys(maps))
    return undefined
  }
  const tileset = tilesets[map.tilesetName]
  if (!tileset) {
    console.warn(
      `Tileset "${map.tilesetName}" is not one of available tilesets`,
      Object.keys(tilesets),
    )
    return undefined
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

    // Each block has 2x2 tiles and 2x2 collisions
    // Each tile has 2x2 textures and lower left texture decides if theres collision or not
    const baseX = x * 2
    const baseY = y * 2
    parsedCollisions[baseX][baseY] = collisions.includes(textureIds[4])
    parsedCollisions[baseX + 1][baseY] = collisions.includes(textureIds[6])
    parsedCollisions[baseX][baseY + 1] = collisions.includes(textureIds[12])
    parsedCollisions[baseX + 1][baseY + 1] = collisions.includes(textureIds[14])
  })
  return {
    name: mapName,
    textureIds: parsedTextureIds,
    collisions: parsedCollisions,
  }
}

const getWarpPosition = (map: MapData, location: number) => {
  const { warps } = map.objects
  for (let key in warps) {
    const warp = warps[key]
    if (warp.id === location) {
      const [x, y] = key.split('_')
      return new Point(Number(x), Number(y))
    }
  }
}
