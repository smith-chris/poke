import React, { Component } from 'react'
import { Roof } from './Roof'

type Props = {}

export class House extends Component<Props> {
  render() {
    return (
      <>
        <Roof width={24} height={10} />
      </>
    )
  }
}
