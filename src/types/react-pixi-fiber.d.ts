// tslint:disable
declare module 'react-pixi-fiber' {
  // Those from RPF are throwing errors when anchor is used as PIXI.Point
  type InteractionEventHandler = (e: PIXI.interaction.InteractionEvent) => void
  type Point = PIXI.Point | number

  export type BaseProps = {
    anchor?: Point
    position?: Point
    scale?: Point
    tint?: number
    blendMode?: number
    width?: number
    height?: number
    interactive?: boolean
    pointerdown?: InteractionEventHandler
    alpha?: number
    key?: string | number
  }

  export type SpriteProps = BaseProps & {
    pluginName?: string
    texture?: PIXI.Texture
    vertexData?: Float32Array
  }

  // Quick fix for 'duplicate identifier' error. Go to react-pixi-fiber defs and delete that line
  export class Sprite extends React.Component<SpriteProps> {}

  /** Custom React Reconciler render method. */
  export function render(
    pixiElement: JSX.Element | PIXI.DisplayObject | PIXI.DisplayObject[],
    stage: PIXI.Container,
    callback?: Function,
  ): void

  export const CustomPIXIComponent: <T>(
    behaviour: {
      customDisplayObject?: (props: T) => PIXI.Container
      customApplyProps?: (instance: PIXI.Container, oldProps: T, newProps: T) => void
    },
    name: string,
  ) => React.ComponentClass<T>
}
