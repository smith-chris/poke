import Random from 'random-js'

export default class RandomGenerator extends Random {
  constructor(seed?: number) {
    let engine
    if (seed !== undefined) {
      engine = Random.engines.mt19937().seed(seed)
    } else {
      engine = Random.engines.mt19937().autoSeed()
    }
    super(engine)
  }
}
