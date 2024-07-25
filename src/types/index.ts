import { ChainId, SwapType, Exchange } from '@/constants'

export interface Settings {
  slippageTolerance: number
  transactionDeadline: number
}

export interface SwapStep {
  tokenIn: string // Address of the token to be swapped
  tokenOut: string // Address of the token to receive
  extra: any // Extra data needed for the swap (e.g. UniswapV3 pool fee)
}

export interface SwapRoute {
  chainId: ChainId
  exchange: Exchange
  swapSteps: SwapStep[]
}

export interface QuoteRequest {
  swapType: SwapType
  amountIn: bigint
  swapRoute: SwapRoute
}

export interface QuoteResult {
  swapType: SwapType
  amountIn: bigint
  amountOut: bigint
  swapRoute: SwapRoute
}
