const fs = require('fs')
const path = require('path')
const { getMapConstants } = require('./getMapConst')

// TODO: add support for ES6 imports for loaders and import this from gameTypes.ts
enum Direction {
  N = 'north',
  E = 'east',
  W = 'west',
  S = 'south',
}

const toDirection = (input: string) => {
  // tslint:disable-next-line
  const firstLetter: any = typeof input === 'string' && input[0]
  if (firstLetter) {
    return Direction[firstLetter]
  } else {
    console.warn('Couldnt find direction for ', input)
    return Direction.N
  }
}

const objectRegex = /\n\s([a-z_]+)([a-zA-Z_0-9- ,]*)/g

const tilesetNameRegex = /_h:[\s]*db[\ ]*([A-Z_0-9]*)/
const connectionsRegex = /((NORTH|SOUTH|WEST|EAST)_MAP_CONNECTION)([A-Z -_,0-9]*)\s/g

const parseParams = (params: string) =>
  params
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '')

const getHeaders = (input: string) => {
  let match
  let connections: Record<string, { mapName: string; offset: number }> = {}
  while ((match = connectionsRegex.exec(input))) {
    const [, , direction, params] = match
    const [, mapName, a, b] = parseParams(params)
    connections[toDirection(direction)] = { mapName, offset: Number(a) - Number(b) }
  }

  let tilesetName
  const searchResult = tilesetNameRegex.exec(input)
  if (searchResult && searchResult.length >= 1) {
    tilesetName = searchResult[1]
  } else {
    console.warn('Couldnt find tile name in: ', input, searchResult)
    tilesetName = 'OVERWORLD'
  }
  return { tilesetName, connections }
}

const getObjects = (input: string) => {
  let match
  const warps: Record<string, { location: number; mapName: string; id: number }> = {}
  let warpId = 0
  while ((match = objectRegex.exec(input))) {
    // match is now the next match, in array form.
    const [, name, params] = match
    // For now lets just read wraps
    if (name === 'warp') {
      const [x, y, location, mapName] = parseParams(params)
      warps[`${x}_${y}`] = { location: Number(location), mapName, id: warpId }
      warpId++
    }
  }
  return { warps }
}
const _fixMapName = (originalName: string) => {
  if (originalName.includes('_COPY')) {
    originalName = originalName.replace('_COPY', '')
  }
  if (originalName !== 'CHAMPIONS_ROOM' && originalName.includes('S_ROOM')) {
    originalName = originalName.replace('S_ROOM', '')
  }

  const parsedName = originalName.replace(/[_]*/g, '').toLowerCase()

  if (parsedName.includes('pathentranceroute')) {
    return parsedName.replace('pathentranceroute', 'undergroundpathentranceroute')
  }
  if (parsedName.includes('cinnabarlab')) {
    return parsedName.replace('cinnabarlab', 'lab')
  }
  if (parsedName.includes('gate1f')) {
    return parsedName.replace('gate1f', 'gate')
  }
  if (parsedName.includes('gate2f')) {
    return parsedName.replace('gate2f', 'gateupstairs')
  }
  if (parsedName.includes('silphco')) {
    return parsedName.replace('f', '')
  }

  // If returns an array it means these paths
  // ['maps/', 'data/mapHeaders/', 'data/mapObjects/']
  switch (parsedName) {
    case 'viridianschool':
      return 'school'
    case 'diglettscaveexit':
      return 'diglettscaveroute2'
    case 'diglettscaveentrance':
      return [
        'diglettscaveentranceroute11',
        'diglettscaveroute11',
        'diglettscaveroute11',
      ]
    case 'trashedhouse':
      return 'ceruleanhousetrashed'
    case 'trashedhousecopy': // Doesnt exist - should be ignored?
      return 'ceruleanhousetrashed'
    case 'pokemonfanclub':
      return 'fanclub'
    case 'lancesroom':
      return 'lance'
    case 'halloffame':
      return 'halloffameroom'
    case 'championsroom':
      return 'gary'
    case 'gamecorner':
      return 'celadongamecorner'
    case 'nameratershouse':
      return 'namerater'
    default:
      return parsedName
  }
}

const fixMapName = (input: string) => {
  const res = _fixMapName(input)
  if (Array.isArray(res)) {
    return res
  }
  return [res, res, res]
}

const readMap = (
  basePath: string,
  constant: [string, { width: number; height: number }],
) => {
  let [_mapName, size] = constant
  const [mapsName, headersName, objectsName] = fixMapName(_mapName)
  const blocks = fs.readFileSync(`${basePath}/maps/${mapsName}.blk`).toString()
  const headers = fs
    .readFileSync(`${basePath}/data/mapHeaders/${headersName}.asm`)
    .toString()
  const objects = fs
    .readFileSync(`${basePath}/data/mapObjects/${objectsName}.asm`)
    .toString()
  return {
    blocksData: blocks,
    size,
    objects: getObjects(objects),
    ...getHeaders(headers),
  }
}

module.exports = function mapsLoader(source: string) {
  const mapConstants = getMapConstants(source)
  const basePath = path.resolve(this.resourcePath, '../..')
  const result: Record<string, {}> = {}
  for (const key in mapConstants) {
    result[key] = readMap(basePath, [key, mapConstants[key]])
  }

  const json = JSON.stringify(result)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

  return `module.exports = ${json}`
}
