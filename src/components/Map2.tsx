import { particles, Rectangle, Sprite, Texture, Container } from 'pixi.js'

import { PixiComponent } from 'utils/fiber'
import { SCREEN_SIZE } from 'app/app'
import { makeMapIDs } from './mapUtils'
import { TILESETS } from 'assets/tilesets'
import { ObjectOf } from 'utils/types'

const PARTICLES = (SCREEN_SIZE / 4) * (SCREEN_SIZE / 4)

const getTexture = (tilesetName: string, id: number) =>
  TILESETS[tilesetName].cutTexture((id % 16) * 8, Math.floor(id / 16) * 8, 8, 8)

type Props = {
  slice: Rectangle
  game: StoreState['game']
}

export const MapBase = PixiComponent<Props, Container>('Map2', {
  create: () => {
    this.oldSprites = {}
    this.lastTileset = ''
    const container = new Container()
    this.tiles = new particles.ParticleContainer(PARTICLES, {
      uvs: true,
      position: true,
    })
    container.addChild(this.tiles)
    return container
  },
  applyProps: (container, oldProps, newProps) => {
    const { game, slice: mapRect } = newProps
    const { currentMap, player, maps } = game
    const oldPlayer = (oldProps.game && oldProps.game.player) || {}
    if (currentMap.center && player.position !== oldPlayer.position) {
      const { center } = currentMap
      if (!center) {
        console.warn('No current map!', currentMap)
        return null
      }
      const centerMap = maps[center.name]
      const { tilesetName } = centerMap
      if (this.lastTileset !== tilesetName) {
        this.tiles.removeChildren()
        this.oldSprites = {}
        this.lastTileset = tilesetName
      }
      const mapIDs = makeMapIDs(game, mapRect)
      if (!mapIDs || mapIDs.length <= 0) {
        return
      }

      const newSprites: ObjectOf<Sprite> = {}
      const todo = []

      for (const item of mapIDs) {
        if (!item) {
          continue
        }
        const [x, y, id] = item
        const sid = `${x}_${y}_${id}`
        if (!this.oldSprites[sid]) {
          todo.push(item)
        } else {
          newSprites[sid] = this.oldSprites[sid]
          delete this.oldSprites[sid]
        }
      }

      const leftovers: Sprite[] = Object.values(this.oldSprites)
      for (const item of todo) {
        const [x, y, id] = item
        const sid = `${x}_${y}_${id}`
        const texture = getTexture(tilesetName, id)
        let sprite = leftovers.pop()
        if (!sprite) {
          sprite = new Sprite()
          this.tiles.addChild(sprite)
        }
        sprite.texture = texture
        sprite.position.x = x * 8
        sprite.position.y = y * 8
        newSprites[sid] = sprite
      }
      for (const item of leftovers) {
        this.tiles.removeChild(item)
      }
      this.oldSprites = newSprites
    }
  },
})
