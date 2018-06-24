type SpaceMapFunc<T> = (a: number, b: number) => T

export const loop = <T>(
  a: number,
  b?: number | SpaceMapFunc<T>,
  c?: SpaceMapFunc<T>,
) => {
  const func = typeof b === 'function' ? b : c
  if (!func) {
    return []
  }
  const result = []
  if (b && c) {
    for (let _a = 0; _a < a; _a++) {
      for (let _b = 0; _b < b; _b++) {
        result.push(func(_a, _b))
      }
    }
  } else {
    for (let _a = 0; _a < a; _a++) {
      result.push(func(_a, 0))
    }
  }
  return result
}
