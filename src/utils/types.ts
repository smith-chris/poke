export type ObjectOf<T> = {
  [key: string]: T
}

type Copy<T> = { [K in keyof T]: T[K] }
type DeepCopy<T> = { [K in keyof T]: T[K] extends {} ? Copy<T[K]> : T[K] }
export type Extend<Base, T> = DeepCopy<Base & T>
