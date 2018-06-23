// tslint:disable
declare module 'redux-devtools-inspector' {
  type Props = {
    dispatch?: () => void
    computedStates?: any[]
    stagedActionIds?: any[]
    actionsById?: {}
    currentStateIndex?: number
    monitorState?: {
      initialScrollTop?: number
    }
    preserveScrollTop?: boolean
    draggableActions?: boolean
    stagedActions?: any[]
    select: (state: StoreState) => object
    theme?: {} | string
    supportImmutable?: boolean
    diffObjectHash?: () => void
    diffPropertyFilter?: () => void
    hideMainButtons?: boolean
    hideActionButtons?: boolean
  }

  const Inspector: React.ComponentClass<Props>
  export default Inspector
}
