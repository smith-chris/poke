import React, { Component, ReactNode } from 'react'
import { particles, Rectangle, Sprite } from 'pixi.js'
import { PixiComponent } from 'utils/fiber'
import { viewport } from 'app/app'
import { makeMapIDs } from './mapUtils'
import { TILESETS } from 'assets/tilesets'
import { ObjectOf } from 'utils/types'
import { TEXTURE_SIZE, TILE_SIZE } from 'assets/const'
import { Point } from 'utils/point'
import { Flower } from './Flower'
import { Water } from './Water'

// TODO: Make it better. This is not good

const PARTICLES = Math.round(((viewport.width / 4) * (viewport.height / 4)) / 4) * 4

const getTexture = (tilesetName: string, id: number) =>
  TILESETS[tilesetName].cutTexture(
    (id % TILE_SIZE) * TEXTURE_SIZE,
    Math.floor(id / TILE_SIZE) * TEXTURE_SIZE,
    TEXTURE_SIZE,
    TEXTURE_SIZE,
  )

type MapBaseProps = {
  tilesetName: string
  mapIds: [number, number, number][]
}

export const MapBase = PixiComponent<MapBaseProps, particles.ParticleContainer>(
  'MapBase',
  {
    create: () => {
      this.oldSprites = {}
      this.lastTileset = ''
      return new particles.ParticleContainer(PARTICLES, {
        uvs: true,
        position: true,
      })
    },
    applyProps: (container, _, newProps) => {
      const { tilesetName, mapIds } = newProps
      if (this.lastTileset !== tilesetName) {
        container.removeChildren()
        this.oldSprites = {}
        this.lastTileset = tilesetName
      }
      const newSprites: ObjectOf<Sprite> = {}
      const todo = []

      for (const item of mapIds) {
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
        if (id === 3 || id === 20) {
          continue
        }
        const sid = `${x}_${y}_${id}`
        const texture = getTexture(tilesetName, id)
        let sprite = leftovers.pop()
        if (!sprite) {
          sprite = new Sprite()
          container.addChild(sprite)
        }
        sprite.texture = texture
        sprite.position.x = x * TEXTURE_SIZE
        sprite.position.y = y * TEXTURE_SIZE
        newSprites[sid] = sprite
      }
      for (const item of leftovers) {
        container.removeChild(item)
      }
      this.oldSprites = newSprites
    },
  },
)

type Props = {
  slice: Rectangle
  game: StoreState['game']
}

type State = MapBaseProps & {
  playerPosition: Point
  animations: ReactNode
}

export class MapTiles extends Component<Props, State> {
  static getDerivedStateFromProps({ game, slice }: Props): State | null {
    const { currentMap, maps, player } = game

    const { center } = currentMap
    if (!center) {
      console.warn('No current map!', currentMap)
      return null
    }
    const centerMap = maps[center.name]
    const { tilesetName } = centerMap
    const mapIds = makeMapIDs(game, slice)
    if (!mapIds || mapIds.length <= 0) {
      return null
    }
    const animations: ReactNode[] = []
    for (const item of mapIds) {
      const [x, y, id] = item
      switch (id) {
        case 3:
          animations.push(
            <Flower
              key={`${x}x${y}`}
              position={new Point(x * TEXTURE_SIZE, y * TEXTURE_SIZE)}
            />,
          )
          break
        case 20:
          animations.push(
            <Water
              key={`${x}x${y}`}
              position={new Point(x * TEXTURE_SIZE, y * TEXTURE_SIZE)}
            />,
          )
          break
        default:
          break
      }
    }
    return {
      tilesetName,
      mapIds,
      playerPosition: player.position,
      animations,
    }
  }
  shouldComponentUpdate(_: {}, { playerPosition }: State) {
    return this.state.playerPosition !== playerPosition
  }
  render() {
    const { tilesetName, mapIds, animations } = this.state
    return (
      <>
        {animations}
        <MapBase tilesetName={tilesetName} mapIds={mapIds} />
      </>
    )
  }
}
