export const ascii2hex = (input: string) => {
  const arr = []
  for (let i = 0, l = input.length; i < l; i++) {
    const hex = Number(input.charCodeAt(i)).toString(16)
    arr.push(hex)
  }
  return arr
}
