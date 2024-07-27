/**
 * @jest-environment node
 */

import { BaseSwapService } from '@/services/baseSwap'
import { ChainId, Exchange, SwapType } from '@/constants'
import { SwapRoute } from '@/types'

const POLYGON_WMATIC = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
const POLYGON_USDC = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

describe('baseSwap', () => {
  const baseSwapService = new BaseSwapService()

  test('quote exact input - single route', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e18), [route])

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_IN)
    expect(result?.amountIn).toBe(BigInt(10e18))
    expect(result?.amountOut).toBeGreaterThan(BigInt(0))
  })
})
