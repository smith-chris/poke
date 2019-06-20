import Redux, {
  createStore,
  combineReducers,
  applyMiddleware,
  bindActionCreators,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { transformActions } from 'utils/redux'
import { makeSubscribe } from 'store/makeSubscribe'
import { gameActionCreators, gameReducer } from './gameStore'
import { GameState } from './gameResolvers'

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

export const store: Store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(transformActions)),
)

export const actions = bindActionCreators(gameActionCreators, store.dispatch)

export const subscribe = makeSubscribe(store)
