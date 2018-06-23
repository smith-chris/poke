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

type Props = {}

const roofHeight = 10
const middleTop = (roofHeight - 2) * unit

export class OaksHouse extends Component<Props> {
  render() {
    return (
      <>
        <Roof width={24} height={roofHeight} />
        {/* Line 1 */}
        {loop(3, x => (
          <Sprite
            key={`window_${x}`}
            texture={window}
            position={new Point(4 * unit + x * window.width, middleTop)}
          />
        ))}
        {loop(2, x => (
          <Sprite
            key={`brick${x}`}
            texture={brick}
            position={new Point(10 * unit + x * brick.width, middleTop)}
          />
        ))}
        {loop(3, x => (
          <Sprite
            key={`window_${x}`}
            texture={window}
            position={new Point(14 * unit + x * window.width, middleTop)}
          />
        ))}
        {/* Line 2 */}
        {loop(3, x => (
          <Sprite
            key={`wood_${x}`}
            texture={wood}
            position={new Point(2 * unit + x * brick.width, middleTop + 2 * unit)}
          />
        ))}
        {loop(7, x => (
          <Sprite
            key={`brick_${x}`}
            texture={brick}
            position={new Point(8 * unit + x * brick.width, middleTop + 2 * unit)}
          />
        ))}
        {/* Line 3 */}
        {loop(3, x => (
          <Sprite
            key={`window_${x}`}
            texture={window}
            position={new Point(2 * unit + x * window.width, middleTop + 4 * unit)}
          />
        ))}
        {loop(5, x => (
          <Sprite
            key={`window_${x}`}
            texture={window}
            position={new Point(12 * unit + x * window.width, middleTop + 4 * unit)}
          />
        ))}
        <Sprite texture={door} position={new Point(8 * unit, middleTop + 4 * unit)} />
        {/* Bottom */}
        {loop(3, x => (
          <Sprite
            key={`wallBottom_${x}`}
            texture={wallBottom}
            position={new Point(2 * unit + x * window.width, middleTop + 6 * unit)}
          />
        ))}
        {loop(5, x => (
          <Sprite
            key={`wallBottom_${x}`}
            texture={wallBottom}
            position={new Point(12 * unit + x * window.width, middleTop + 6 * unit)}
          />
        ))}
        {/* Walls */}
        <Sprite
          texture={wallCornerLeft}
          position={new Point(0, middleTop + 6 * unit)}
        />
        {loop(2, y => (
          <Sprite
            key={`wallRight_${y}`}
            texture={wallRight}
            position={new Point(22 * unit, middleTop + 2 * unit + y * wallRight.height)}
          />
        ))}
        {loop(2, y => (
          <Sprite
            key={`wallLeft_${y}`}
            texture={wallLeft}
            position={new Point(0, middleTop + 2 * unit + y * wallRight.height)}
          />
        ))}
        <Sprite
          texture={wallCornerRight}
          position={new Point(22 * unit, middleTop + 6 * unit)}
        />
      </>
    )
  }
}
