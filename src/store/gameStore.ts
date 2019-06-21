import { makeActionCreators, makeReducer } from 'utils/auto-redux'
import * as gameResolvers from './gameResolvers'
import { Point } from 'utils/point'
import { GameState } from './gameTypes'

export const initialState: GameState = {
  player: {
    position: new Point(12, 12),
    moved: false,
  },
  controls: {},
  maps: {},
  tilesets: {},
  currentMap: {},
}

export const gameActionCreators = makeActionCreators(gameResolvers, initialState)
export const gameReducer = makeReducer(gameResolvers, initialState)
