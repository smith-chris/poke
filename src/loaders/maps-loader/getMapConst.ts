const getMatches = (input: string, regex: RegExp) => {
  const matches = []
  let match
  while ((match = regex.exec(input))) {
    matches.push(match)
  }
  return matches
}

const mapConstRegex = /mapconst ([A-Z_0-9]*),[ ]*([0-9]*),[ ]*([0-9]*)/g

exports.getMapConstants = (
  input: string,
): Record<string, { width: number; height: number }> =>
  getMatches(input, mapConstRegex).reduce(
    (result, [, name, height, width]) =>
      name.includes('UNUSED')
        ? result
        : {
            ...result,
            [name]: { width: Number(width), height: Number(height) },
          },
    {},
  )
