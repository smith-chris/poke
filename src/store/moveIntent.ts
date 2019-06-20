import { gameActionCreators } from './gameStore'
import { GameState } from './gameResolvers'
import { Direction } from './game'
import { canMove } from './gameUtils'
import { Point } from 'utils/point'
import { getNextPosition } from './gameTransforms/move'

type MoveActions = Pick<
  typeof gameActionCreators,
  'moveStart' | 'moveContinue' | 'moveEnd' | 'loadMap'
>

export const moveIntent = (
  { player, currentMap, controls, maps }: GameState,
  actions: MoveActions,
  direction?: Direction,
) => {
  const moveDirection = direction || controls.move
  const from = player.destination || player.position
  if (!moveDirection) {
    console.warn('No move direction!', { controls, direction })
    return
  }
  if (!currentMap.center) {
    console.warn('No current map!', currentMap)
    return
  }
  const playerCanMove = canMove(from, moveDirection, currentMap.center.collisions)
  if (playerCanMove) {
    if (player.destination === undefined) {
      // Check if can move - if not, check for undefined collision
      actions.moveStart(moveDirection)
    } else {
      actions.moveContinue()
    }
    return true
  } else if (playerCanMove === undefined) {
    const { x, y } = from
    const { objects, connections, size } = maps[currentMap.center.name]
    const warp = objects.warps[`${x}_${y}`]

    if (warp) {
      const { mapName, location } = warp
      if (mapName === '-1') {
        actions.loadMap({ mapName: 'PALLET_TOWN', location, exit: true })
        return false
      }
    }

    const to = getNextPosition(from, moveDirection)
    const { north, east, west, south } = connections
    const northMap = north && maps[north.mapName]
    const eastMap = east && maps[east.mapName]
    const westMap = west && maps[west.mapName]
    const southMap = south && maps[south.mapName]
    if (to.y < 0) {
      if (north && northMap) {
        const position = new Point(from.x - north.offset * 2, northMap.size.height * 2)
        const destination = new Point(position.x, position.y - 1)

        actions.loadMap({
          mapName: north.mapName,
          playerData: { position, destination, direction: Direction.N },
        })
      }
      return true
    } else if (to.y >= size.height * 2) {
      if (south && southMap) {
        const position = new Point(from.x - south.offset * 2, -1)
        const destination = new Point(position.x, 0)

        actions.loadMap({
          mapName: south.mapName,
          playerData: { position, destination, direction: Direction.S },
        })
      }
      return true
    } else if (to.x >= size.width * 2) {
      if (east && eastMap) {
        const position = new Point(-1, from.y - east.offset * 2)
        const destination = new Point(0, position.y)

        actions.loadMap({
          mapName: east.mapName,
          playerData: { position, destination, direction: Direction.E },
        })
      }
      return true
    } else if (to.x < 0) {
      if (west && westMap) {
        const position = new Point(westMap.size.width * 2, from.y - west.offset * 2)
        const destination = new Point(position.x - 1, position.y)

        actions.loadMap({
          mapName: west.mapName,
          playerData: { position, destination, direction: Direction.W },
        })
      }
      return true
    }
  }
  return false
}
