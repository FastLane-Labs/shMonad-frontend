import { QuoteRequest, QuoteResult, SwapRoute } from '@/types'

interface IBaseSwapService {
  getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): QuoteResult
  getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): QuoteResult
}

export class BaseSwapService implements IBaseSwapService {
  getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): QuoteResult {
    if (!candidates.length) {
      throw new Error('No swap route candidates provided')
    }

    if (candidates.length === 1) {
      return {} as QuoteResult
    }

    return {} as QuoteResult
  }

  getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): QuoteResult {
    // TODO
    return {} as QuoteResult
  }
}
