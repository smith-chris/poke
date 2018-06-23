import { composeWithDevTools } from 'redux-devtools-extension'
import Redux, { createStore, combineReducers, applyMiddleware } from 'redux'
import { uiReducer, UIState } from './ui'
import { transformActions } from 'utils/redux'

declare global {
  type StoreState = {
    readonly ui: UIState
  }

  type Store = Redux.Store<StoreState>

  type Dispatch = Redux.Dispatch<StoreState>
}

export const reducers = combineReducers<StoreState>({
  ui: uiReducer,
})

export const store: Store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(transformActions)),
)
