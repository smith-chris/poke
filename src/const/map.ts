import { ObjectOf } from 'utils/types'
import map_constants from 'constants/map_constants.asm'

const getMatches = (input: string, regex: RegExp) => {
  const matches = []
  let match
  while ((match = regex.exec(input))) {
    matches.push(match)
  }
  return matches
}

const mapConstRegex = /mapconst ([A-Z_0-9]*),[ ]*([0-9]*),[ ]*([0-9]*)/g

export const MAP_CONSTANTS: ObjectOf<{ width: number; height: number }> = getMatches(
  map_constants,
  mapConstRegex,
).reduce(
  (result, [, name, height, width]) =>
    name.includes('UNUSED')
      ? result
      : {
          ...result,
          [name]: { width: Number(width), height: Number(height) },
        },
  {},
)
