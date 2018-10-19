import { TILE_SIZE } from 'assets/const'
import { SCREEN_SIZE, DEBUG_MAP } from 'app/app'
import { Point } from 'utils/point'
import { Rectangle } from 'pixi.js'
import { GameState, toDirection, Direction } from 'store/game'
import { LoadedMap } from 'store/gameTransforms/loadMap'
import { OVERWORLD } from 'assets/tilesets'

export const MOVE_DISTANCE = TILE_SIZE

const MAP_CENTER = {
  x: SCREEN_SIZE / 2 - TILE_SIZE / 2,
  y: SCREEN_SIZE / 2 - TILE_SIZE / 2,
}

export const getMapPosition = (player: Point) =>
  new Point(MAP_CENTER.x - player.x * 16, MAP_CENTER.y - player.y * 16 + 4)

// tslint:disable-next-line
export const mapRectangle = <T extends any>(
  rect: Rectangle,
  f: (x: number, y: number) => T,
) => {
  const results: T[] = []
  for (let x = rect.x; x <= rect.width + rect.x; x++) {
    for (let y = rect.y; y <= rect.height + rect.y; y++) {
      results.push(f(x, y))
    }
  }
  return results
}

export const makeGetTextureId = (game: GameState) => {
  const { currentMap, maps } = game
  const { center } = currentMap
  if (!center) {
    console.warn('No current map!', currentMap)
    return undefined
  }
  const centerMap = maps[center.name]
  if (!centerMap) {
    console.warn('No center map', center.name, maps)
    return undefined
  }

  const centerRect = new Rectangle(
    0,
    0,
    centerMap.size.width * 4,
    centerMap.size.height * 4,
  )

  // Could be using something like 'typedEntries' to get better typings
  const connectionsData = Object.entries(currentMap)
    .filter(
      ([key, value]) =>
        toDirection(key) !== undefined &&
        value !== undefined &&
        maps[value.name] !== undefined,
    )
    .map(([direction, { textureIds, name }]: [Direction, LoadedMap]) => ({
      direction,
      textureIds,
      width: maps[name].size.width * 4,
      height: maps[name].size.height * 4,
      offset: centerMap.connections[direction].offset * 4,
    }))

  const getConnectionTextureID = (x: number, y: number) => {
    for (const { direction, textureIds, width, height, offset } of connectionsData) {
      // Basically top left cornerd of rendered connection map
      let finalX, finalY
      switch (direction) {
        case Direction.N:
          if (y >= 0) {
            continue
          }
          finalX = x - offset
          finalY = y + height
          break
        case Direction.E:
          if (x < centerRect.right) {
            continue
          }
          finalX = x - centerRect.width
          finalY = y - offset
          break
        case Direction.W:
          if (x >= 0) {
            continue
          }
          finalX = x + width
          finalY = y - offset
          break
        case Direction.S:
          if (y < centerRect.bottom) {
            continue
          }
          finalX = x - offset
          finalY = y - centerRect.height
          break
        default:
          continue
      }

      const isOutsideMapWidth = finalX < 0 || finalX >= width
      const isOutsideMapHeight = finalY < 0 || finalY >= height
      if (!isOutsideMapWidth && !isOutsideMapHeight) {
        return [textureIds[finalX] && textureIds[finalX][finalY], false]
      }
    }
    return undefined
  }

  return (x: number, y: number) => {
    const isInCenterMapWidth = x >= 0 && x < centerRect.right
    const isInCenterMapHeight = y >= 0 && y < centerRect.bottom

    if (isInCenterMapWidth && isInCenterMapHeight) {
      return [center && center.textureIds[x] && center.textureIds[x][y], true]
    }

    return getConnectionTextureID(x, y)
  }
}

export const makeMapIDs = (game: GameState, slice: Rectangle) => {
  const { currentMap, maps } = game
  const { center } = currentMap
  if (!center) {
    console.warn('No current map!', currentMap)
    return null
  }
  const centerMap = maps[center.name]
  const getTextureInd = makeGetTextureId(game)
  if (!getTextureInd) {
    return
  }

  const isOverworld = centerMap.tilesetName === OVERWORLD

  return mapRectangle(slice, (x, y) => {
    let textureId = getTextureInd(x, y)
    if (!textureId) {
      if (DEBUG_MAP) {
        return null
      }
      if (isOverworld) {
        textureId = [82]
      } else {
        return null
      }
    }
    const [ID] = textureId
    return [x, y, ID]
  })
}
