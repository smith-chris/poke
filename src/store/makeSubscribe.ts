import isEqual from 'lodash.isequal'

type Slice<T> = T
type SliceState<T> = (state: StoreState) => Slice<T>
type Subscriber<T> = (newSlice: Slice<T>, oldSlice: Slice<T>) => void

export const makeSubscribe = (store: Store) => <T>(
  sliceState: SliceState<T>,
  subscriber: Subscriber<T>,
) => {
  let currentSlice = sliceState(store.getState())
  store.subscribe(() => {
    const newSlice = sliceState(store.getState())
    if (!isEqual(currentSlice, newSlice)) {
      const oldSlice = currentSlice
      currentSlice = newSlice
      subscriber(newSlice, oldSlice)
    }
  })
}
