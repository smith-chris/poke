/* tslint:disable-next-line: no-any */
export const assertNever = (value: never, { state = undefined as any } = {}): never => {
  if (state) {
    // Used for redux reducers that have to return state on default case
    return state as never
  }
  if (value) {
    console.warn(`Not handled union value: ${JSON.stringify(value)}`)
  }
  return value
}

export const shallowDiff = <T extends {}>(a: T, b: T) => {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return true
    }
  }
  return false
}
