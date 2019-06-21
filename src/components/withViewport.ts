import { ComponentType, Component, createElement } from 'react'
import { viewport } from 'app/app'
import debounce from 'lodash.debounce'

export type Viewport = {
  width: number
  height: number
}

export type ViewportProps = {
  viewport: Viewport
}

export const withViewport = <T extends ViewportProps>(component: ComponentType<T>) => {
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
    }, 55)
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
