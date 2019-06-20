import { makeActionCreators, makeReducer } from 'utils/auto-redux'
import * as boardResolvers from './gameResolvers'
import { Point } from 'utils/point'

export const initialState: boardResolvers.GameState = {
  player: {
    position: new Point(12, 12),
    moved: false,
  },
  controls: {},
  maps: {},
  tilesets: {},
  currentMap: {},
}

export const gameActionCreators = makeActionCreators(boardResolvers, initialState)
export const gameReducer = makeReducer(boardResolvers, initialState)
