import React from 'react'
import { Player } from './Player'
import { Map } from './Map'
import { Container } from 'utils/fiber'
import { Point } from 'utils/point'

export const Game = () => (
  <>
    <Map />
    <Player />
  </>
)
