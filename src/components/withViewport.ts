import { ComponentType, Component, createElement } from 'react'
import { viewport } from 'app/app'
import { Omit } from 'utils/fiber'

const debounce = function(func: Function, wait: number, immediate?: boolean) {
  // tslint:disable-next-line
  let timeout: any
  return function() {
    let context = this,
      args = arguments
    let later = function() {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

export type Viewport = {
  width: number
  height: number
}

export type ViewportProps = {
  viewport: Viewport
}

export const withViewport = <T extends ViewportProps>(component: ComponentType<T>) => {
  // tslint:disable-next-line
  return class extends Component<Omit<T, keyof ViewportProps>, ViewportProps> {
    state = {
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
    }
    handleResize = debounce(() => {
      this.setState({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      })
    }, 250)
    componentDidMount() {
      window.addEventListener('resize', this.handleResize)
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
    }
    render() {
      // @ts-ignore deal with it later
      return createElement(component, { ...this.props, ...this.state })
    }
  }
}
