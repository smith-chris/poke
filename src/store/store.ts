import Redux, { createStore, combineReducers, bindActionCreators } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { makeSubscribe } from 'store/makeSubscribe'
import { gameActionCreators, gameReducer } from './gameStore'
import { GameState } from './gameTypes'

declare global {
  type StoreState = {
    readonly game: GameState
  }

  type Store = Redux.Store<StoreState>

  type Dispatch = Redux.Dispatch<StoreState>
}

export const reducers = combineReducers<StoreState>({
  game: gameReducer,
})

export const store: Store = createStore(reducers, composeWithDevTools())

export const actions = bindActionCreators(gameActionCreators, store.dispatch)

export const subscribe = makeSubscribe(store)
