// tslint:disable
import { Component } from 'react'
import { ContainerProperties, SpriteProperties } from 'react-pixi-fiber'
import { Point } from './point'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type Obj<Keys extends string> = { [K in Keys]: any }

type FixProps<T extends { anchor?: any }> = Omit<T, 'anchor'> & {
  anchor: number | Point
}

export class Container extends Component<ContainerProperties> {}
export class Sprite extends Component<FixProps<SpriteProperties>> {}
