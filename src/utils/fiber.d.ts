// tslint:disable
import { Component, ComponentClass } from 'react'
import {
  ContainerProperties,
  SpriteProperties,
  TilingSpriteProperties,
  ParticleContainerProperties,
} from '@inlet/react-pixi'
export { PixiComponent } from '@inlet/react-pixi'
import { Point } from './point'

type Obj<Keys extends string> = { [K in Keys]: any }

type FixProps<T extends { anchor?: any }> = Omit<T, 'anchor'> & {
  anchor?: number | Point
}

export class Container extends Component<ContainerProperties> {}

export type SpriteProps = FixProps<SpriteProperties>
export class Sprite extends Component<SpriteProps> {}

export type TilingSpriteProps = TilingSpriteProperties
export class TilingSprite extends Component<TilingSpriteProps> {}

export type ParticleContainerProps = ParticleContainerProperties
export class ParticleContainer extends Component<ParticleContainerProps> {}
