import { Exchange } from './base'
import { Token, SwapStep } from '@/types'

const POOL_FEES = [500, 3000, 10000]

export class UniswapV3 extends Exchange {
  /**
   * inherited and overriden from Exchange
   */
  public static buildSwapStepsFromTokens(from: Token, to: Token): SwapStep[] {
    let swapSteps: SwapStep[] = []

    for (const poolFee of POOL_FEES) {
      swapSteps.push({
        tokenIn: from,
        tokenOut: to,
        extra: {
          fee: poolFee,
        },
      })
    }

    return swapSteps
  }
}
