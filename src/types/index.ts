import { ChainId } from '@/constants'

export interface Settings {
  slippageTolerance: number
  transactionDeadline: number
}

export interface SwapStep {
  tokenIn: string // Address of the token to be swapped
  tokenOut: string // Address of the token to receive
  exchange: string // Name of the exchange for this step
}

export interface SwapRoute {
  chainId: ChainId
  swapSteps: SwapStep[]
}

export interface QuoteRequest {
  chainId: ChainId
  swapRoute: SwapRoute
  amountIn: string
}

export interface QuoteResult {
  chainId: ChainId
  amountIn: string
  amountOut: string
  swapRoute: SwapRoute
  exchange: string
}
