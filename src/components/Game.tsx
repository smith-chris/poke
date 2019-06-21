import React from 'react'
import { Player } from './Player/Player'
import { Map } from './Map/Map'
import { Container } from 'utils/fiber'
import { Point } from 'utils/point'
import { DEBUG_MAP_BOUNDS, DEBUG_OFFSET } from 'app/app'
import { Rect } from './Rect'
import { withViewport } from './withViewport'

const BoundsDebugContainer = withViewport(({ children, viewport }) => {
  const realWidth = viewport.width + DEBUG_OFFSET * 2
  const realHeight = viewport.height + DEBUG_OFFSET * 2
  return (
    <>
      <Container position={new Point(DEBUG_OFFSET, DEBUG_OFFSET)}>{children}</Container>
      <Rect alpha={0.3} width={realWidth} height={DEBUG_OFFSET} x={0} y={0} />
      <Rect
        alpha={0.3}
        width={DEBUG_OFFSET}
        height={realHeight}
        x={realWidth - DEBUG_OFFSET}
        y={0}
      />
      <Rect
        alpha={0.3}
        width={realWidth}
        height={DEBUG_OFFSET}
        x={0}
        y={realHeight - DEBUG_OFFSET}
      />
      <Rect alpha={0.3} width={DEBUG_OFFSET} height={realHeight} x={0} y={0} />
    </>
  )
})

export const Game = () => {
  let result = (
    <>
      <Map />
      <Player />
    </>
  )
  if (DEBUG_MAP_BOUNDS) {
    return <BoundsDebugContainer>{result}</BoundsDebugContainer>
  }
  return result
}
