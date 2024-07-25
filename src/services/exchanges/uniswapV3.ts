import { Exchange } from './base'
import { QuoteRequest, QuoteResult, SwapRoute } from '@/types'
import { CONTRACT_ADDRRESSES } from '@/constants'

export class UniswapV3 extends Exchange {
  public static getQuote(quoteRequest: QuoteRequest): QuoteResult {
    // TODO
    return {} as QuoteResult
  }

  public static getQuoteCallData(quoteRequest: QuoteRequest): string {
    // TODO
    return ''
  }
}
