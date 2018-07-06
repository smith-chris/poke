export const parseHexData = (input: string) => {
  const result = []
  for (let i = 0; i < input.length; i++) {
    const value = Number(input.charCodeAt(i))
    result.push(value)
  }
  return result
}
