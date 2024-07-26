export interface SwapRoute {
  fromChainId?: number
  toChainId?: number
  fromTokenAddress?: string
  toTokenAddress?: string
  destinationAddress?: string
  direction?: SwapDirection
}

export type SwapDirection = 'buy' | 'sell'
