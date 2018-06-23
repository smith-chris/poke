declare module '*.png' {
  export type ImageAsset = {
    src: string
    width: number
    height: number
  }

  const image: ImageAsset

  export default image
}
