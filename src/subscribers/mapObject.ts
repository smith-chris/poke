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
    const map = currentMap.center ? maps[currentMap.center.name] : null
    if (map) {
      const { objects } = map
      const { x, y } = position
      const warp = objects.warps[`${x}_${y}`]
      if (warp) {
        const { mapName, location } = warp
        if (mapName !== '-1') {
          actions.loadMap({ mapName, location })
        }
      }
    }
  },
)
