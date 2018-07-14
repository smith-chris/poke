// tslint:disable
declare module 'react-pixi-fiber' {
  /** Overriding Custom React Reconciler render method. */
  export function render(
    pixiElement: JSX.Element | PIXI.DisplayObject | PIXI.DisplayObject[],
    stage: PIXI.Container,
    callback?: Function,
  ): void
}
