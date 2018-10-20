import { ComponentType, Component, createElement } from 'react'
import { viewport } from 'app/app'
import { Omit } from 'utils/fiber'

export type ViewportProps = {
  viewport: {
    width: number
    height: number
  }
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
    handleResize = () => {
      this.setState({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      })
    }
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
