import { config } from '../../wagmi.config'
import { SwapType } from '@/constants'
import { QuoteRequest, QuoteResult, SwapRoute } from '@/types'
import { getExchange } from '@/services/exchanges'
import { multicall } from '@wagmi/core'
import { ContractFunctionParameters } from 'viem'

interface IBaseSwapService {
  getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined>
  getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined>
}

export class BaseSwapService implements IBaseSwapService {
  /**
   * Get the best quote from a list of candidates routes for an exact input swap
   * @param amountIn The exact amount in
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  async getBestQuoteExactIn(amountIn: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined> {
    return this.getBestQuote(SwapType.EXACT_IN, amountIn, candidates)
  }

  /**
   * Get the best quote from a list of candidates routes for an exact output swap
   * @param amountOut The exact amount out
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  async getBestQuoteExactOut(amountOut: bigint, candidates: SwapRoute[]): Promise<QuoteResult | undefined> {
    return this.getBestQuote(SwapType.EXACT_OUT, amountOut, candidates)
  }

  /**
   * Get the best quote from a list of candidates routes
   * @param swapType The swap type (exact in or exact out)
   * @param amount The amount in or out depending on the swap type
   * @param candidates The swap route candidates
   * @returns The best quote result or undefined in case of failure
   */
  protected async getBestQuote(
    swapType: SwapType,
    amount: bigint,
    candidates: SwapRoute[]
  ): Promise<QuoteResult | undefined> {
    if (!candidates.length) {
      console.debug('getBestQuote: no swap route candidates provided')
      return
    }

    if (candidates.length === 1) {
      // Single candidate, direct quote call
      const quoteRequest: QuoteRequest = {
        swapType: swapType,
        amount: amount,
        swapRoute: candidates[0],
      }

      return getExchange(candidates[0].exchange).getQuote(quoteRequest)
    }

    // Multicall when more than one candidate
    let quoteRequests: QuoteRequest[] = []
    let calls: ContractFunctionParameters[] = []

    for (const candidate of candidates) {
      const quoteRequest: QuoteRequest = {
        swapType: swapType,
        amount: amount,
        swapRoute: candidate,
      }

      quoteRequests.push(quoteRequest)
      calls.push(getExchange(candidate.exchange).getQuoteContractCall(quoteRequest))
    }

    const results = await multicall(config, {
      allowFailure: true,
      contracts: calls,
    })

    let bestAmount = BigInt(0)
    let bestQuoteResult: QuoteResult | undefined

    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'failure') {
        continue
      }

      const quoteResult = getExchange(candidates[i].exchange).getFormattedQuoteResult(
        quoteRequests[i],
        results[i].result
      )

      switch (swapType) {
        case SwapType.EXACT_IN:
          if (quoteResult.amountOut > bestAmount) {
            bestAmount = quoteResult.amountOut
            bestQuoteResult = quoteResult
          }

        case SwapType.EXACT_OUT:
          if (quoteResult.amountIn < bestAmount || bestAmount === BigInt(0)) {
            bestAmount = quoteResult.amountIn
            bestQuoteResult = quoteResult
          }
      }
    }

    return bestQuoteResult
  }
}
