import { SwapType, CONTRACT_ADDRRESSES } from '@/constants'
import { MULTICALL3_ABI, MULTICALL3_ADDR } from '@/constants/multicall3'
import { QuoteRequest, QuoteResult, SwapRoute } from '@/types'
import { getExchange } from '@/services/exchanges'
import { useReadContract } from 'wagmi'

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
      // Single candidate, direct quote call
      const quoteRequest: QuoteRequest = {
        swapType: SwapType.EXACT_IN,
        amountIn: amountIn,
        swapRoute: candidates[0],
      }
      return getExchange(candidates[0].exchange).getQuote(quoteRequest)
    }

    // Multicall when more than one candidate
    let calls = []

    for (const candidate of candidates) {
      const quoteRequest: QuoteRequest = {
        swapType: SwapType.EXACT_IN,
        amountIn: amountIn,
        swapRoute: candidate,
      }

      calls.push({
        target: CONTRACT_ADDRRESSES[candidate.chainId][candidate.exchange].quoter,
        allowFailure: true,
        callData: getExchange(candidate.exchange).getQuoteCallData(quoteRequest),
      })
    }

    const result = useReadContract({
      abi: MULTICALL3_ABI,
      address: MULTICALL3_ADDR,
      functionName: 'aggregate3',
      args: [calls],
    })

    let bestAmountOut = BigInt(0)
    let bestSwapRoute: SwapRoute = candidates[0]

    // TODO: inspect results and get best quote

    return {
      swapType: SwapType.EXACT_IN,
      amountIn: amountIn,
      amountOut: bestAmountOut,
      swapRoute: bestSwapRoute,
    }
  }

  getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): QuoteResult {
    // TODO
    return {} as QuoteResult
  }
}
