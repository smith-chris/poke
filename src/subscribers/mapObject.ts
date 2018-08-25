import { subscribe, actions } from 'store/store'

subscribe(
  ({
    game: {
      player: { position },
      currentMap,
      maps,
      lastMapName,
    },
  }: StoreState) => ({ position, currentMap, maps, lastMapName }),
  ({ position, currentMap, maps, lastMapName }) => {
    const map = currentMap ? maps[currentMap.name] : null
    if (map) {
      const { objects } = map
      const { x, y } = position
      const warp = objects.warps[`${x}_${y}`]
      if (warp) {
        const { mapName, location } = warp
        if (mapName === '-1') {
          if (!lastMapName) {
            console.warn('Last map name is not available', { mapName, lastMapName })
            return
          }
          actions.loadMap({ mapName: lastMapName, location, exit: true })
        } else {
          actions.loadMap({ mapName, location })
        }
      }
    }
  },
)
