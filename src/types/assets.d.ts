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

declare module '*.bst' {
  const blockset: string

  export default blockset
}

declare module '*.asm' {
  const code: string

  export default code
}
