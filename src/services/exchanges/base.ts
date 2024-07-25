import { QuoteRequest, QuoteResult, SwapRoute } from '@/types'

export abstract class Exchange {
  public static getQuote(quoteRequest: QuoteRequest): QuoteResult {
    throw new Error('Method not implemented.')
  }

  public static getQuoteCallData(quoteRequest: QuoteRequest): string {
    throw new Error('Method not implemented.')
  }
}
