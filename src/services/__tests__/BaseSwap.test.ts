/**
 * @jest-environment node
 */

import { BaseSwapService } from '@/services/baseSwap'
import { ChainId, Exchange, SwapType } from '@/constants'
import { SwapRoute } from '@/types'

const POLYGON_WMATIC = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
const POLYGON_USDC = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
const POLYGON_USDT = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'

describe('baseSwap', () => {
  const baseSwapService = new BaseSwapService()

  test('validate swap route candidates - valid', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).not.toThrow()
  })

  test('validate swap route candidates - no candidate', () => {
    const candidates: SwapRoute[] = [] // No routes

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: no swap route candidates provided'
    )
  })

  test('validate swap route candidates - token in/out are same', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, invalid
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: invalid route, tokenIn and tokenOut are the same'
    )
  })

  test('validate swap route candidates - token in mismatch', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_USDT, // Different token in
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: invalid route, tokenIn mismatch'
    )
  })

  test('validate swap route candidates - token out mismatch', () => {
    const candidates: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT, // Different token out
            extra: { fee: 500 },
          },
        ],
      },
    ]

    expect(() => baseSwapService.validateSwapRouteCandidates(candidates)).toThrow(
      'validateSwapRouteCandidates: invalid route, tokenOut mismatch'
    )
  })

  test('quote exact input - single route valid', async () => {
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

  test('quote exact input - single route invalid', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
          extra: { fee: 500 },
        },
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e18), [route])

    expect(result).toBeUndefined()
  })

  test('quote exact output - single route valid', async () => {
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

    const result = await baseSwapService.getBestQuoteExactOut(BigInt(10e6), [route])

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_OUT)
    expect(result?.amountIn).toBeGreaterThan(BigInt(0))
    expect(result?.amountOut).toBe(BigInt(10e6))
  })

  test('quote exact output - single route invalid', async () => {
    const route: SwapRoute = {
      chainId: ChainId.POLYGON,
      exchange: Exchange.UNISWAPV3,
      swapSteps: [
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
          extra: { fee: 500 },
        },
        {
          tokenIn: POLYGON_WMATIC,
          tokenOut: POLYGON_USDC,
          extra: { fee: 500 },
        },
      ],
    }

    const result = await baseSwapService.getBestQuoteExactOut(BigInt(10e6), [route])

    expect(result).toBeUndefined()
  })

  test('quote exact input - multiple routes', async () => {
    const routes: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    const result = await baseSwapService.getBestQuoteExactIn(BigInt(10e18), routes)

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_IN)
    expect(result?.amountIn).toBe(BigInt(10e18))
    expect(result?.amountOut).toBeGreaterThan(BigInt(0))
  })

  test('quote exact output - multiple routes', async () => {
    const routes: SwapRoute[] = [
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_WMATIC, // WMATIC to WMATIC, this route will pass validation but fail to get a quote
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
      {
        chainId: ChainId.POLYGON,
        exchange: Exchange.UNISWAPV3,
        swapSteps: [
          {
            tokenIn: POLYGON_WMATIC,
            tokenOut: POLYGON_USDT,
            extra: { fee: 500 },
          },
          {
            tokenIn: POLYGON_USDT,
            tokenOut: POLYGON_USDC,
            extra: { fee: 500 },
          },
        ],
      },
    ]

    const result = await baseSwapService.getBestQuoteExactOut(BigInt(10e6), routes)

    expect(result).toBeDefined()
    expect(result?.swapType).toBe(SwapType.EXACT_OUT)
    expect(result?.amountIn).toBeGreaterThan(BigInt(0))
    expect(result?.amountOut).toBe(BigInt(10e6))
  })
})
