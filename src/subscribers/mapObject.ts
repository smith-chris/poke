import { subscribe, actions } from 'store/store'

subscribe(
  ({
    game: {
      player: { position },
      currentMap,
      maps,
    },
  }: StoreState) => ({ position, currentMap, maps }),
  ({ position, currentMap, maps }) => {
    const map = currentMap ? maps[currentMap.name] : null
    if (map) {
      const { objects } = map
      const { x, y } = position
      const mapName = objects.warps[`${x}_${y}`]
      if (mapName) {
        actions.loadMap(mapName)
      }
    }
  },
)
