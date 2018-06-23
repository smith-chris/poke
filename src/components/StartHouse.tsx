import React, { Component } from 'react'
import { Roof } from './Roof'
import { overworld, unit } from 'assets'
import { Sprite } from 'react-pixi-fiber'
import { Point } from 'utils/pixi'
import { loop } from 'utils/render'

const window = overworld.cut(20, 0, 2, 2)
const brick = overworld.cut(22, 8, 2, 2)
const door = overworld.cut(22, 0, 4, 4)
const wood = overworld.cut(4, 4, 2, 2)
const wallBottom = overworld.cut(20, 2, 2, 2)
const wallRight = overworld.cut(30, 2, 2, 2)
const wallLeft = overworld.cut(30, 0, 2, 2)
const wallCornerLeft = overworld.cut(28, 8, 2, 2)
const wallCornerRight = overworld.cut(30, 8, 2, 2)

const canopy = overworld.cut(14, 2, 2, 2)
const canopyLeft = overworld.cut(24, 10, 2, 2)
const canopyRight = overworld.cut(26, 10, 2, 2)

type Props = {}

const roofHeight = 6
const middleTop = (roofHeight - 2) * unit

export class StartHouse extends Component<Props> {
  render() {
    return (
      <>
        <Roof width={16} height={roofHeight} />
        {/* Line 1 */}
        <Sprite texture={window} position={new Point(4 * unit, middleTop)} />
        <Sprite texture={wood} position={new Point(6 * unit, middleTop)} />
        {loop(2, x => (
          <Sprite
            key={`window_${x}`}
            texture={window}
            position={new Point(8 * unit + x * window.width, middleTop)}
          />
        ))}
        {/* Line 2 */}
        <Sprite texture={canopyLeft} position={new Point(0, middleTop + 2 * unit)} />
        {loop(6, x => (
          <Sprite
            key={`brick_${x}`}
            texture={canopy}
            position={new Point(2 * unit + x * brick.width, middleTop + 2 * unit)}
          />
        ))}
        <Sprite
          texture={canopyRight}
          position={new Point(14 * unit, middleTop + 2 * unit)}
        />
        {/* Line 3 */}
        <Sprite texture={wood} position={new Point(2 * unit, middleTop + 4 * unit)} />
        <Sprite texture={door} position={new Point(4 * unit, middleTop + 4 * unit)} />
        {loop(2, x => (
          <Sprite
            key={`window_${x}`}
            texture={window}
            position={new Point(8 * unit + x * window.width, middleTop + 4 * unit)}
          />
        ))}
        <Sprite texture={wood} position={new Point(12 * unit, middleTop + 4 * unit)} />
        {/* Bottom */}
        <Sprite
          texture={wallBottom}
          position={new Point(2 * unit, middleTop + 6 * unit)}
        />
        {loop(3, x => (
          <Sprite
            key={`wallBottom_${x}`}
            texture={wallBottom}
            position={new Point(8 * unit + x * window.width, middleTop + 6 * unit)}
          />
        ))}
        {/* Walls */}
        <Sprite texture={wallLeft} position={new Point(0, middleTop + 4 * unit)} />
        <Sprite
          texture={wallCornerLeft}
          position={new Point(0, middleTop + 6 * unit)}
        />
        <Sprite
          texture={wallRight}
          position={new Point(14 * unit, middleTop + 4 * unit)}
        />
        <Sprite
          texture={wallCornerRight}
          position={new Point(14 * unit, middleTop + 6 * unit)}
        />
      </>
    )
  }
}
