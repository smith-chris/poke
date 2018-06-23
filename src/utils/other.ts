export default function assertNever(value: never, noThrow?: boolean): never {
  if (value) {
    console.warn(`Not handled union value: ${JSON.stringify(value)}`)
  }
  return value
}
