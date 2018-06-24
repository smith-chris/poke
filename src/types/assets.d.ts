declare module '*.png' {
  export type ImageAsset = {
    src: string
    width: number
    height: number
  }

  const image: ImageAsset

  export default image
}

declare module '*.blk' {
  const map: string

  export default map
}
