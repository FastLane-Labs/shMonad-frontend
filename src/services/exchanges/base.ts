import { Token, SwapStep } from '@/types'

/**
 * Base class for exchanges. All exchanges should extend this class and implement the required methods.
 * @abstract
 */
export abstract class Exchange {
  /**
   * Build the possible swap steps for a pair of tokens
   * @param from The token to swap from
   * @param to The token to swap to
   * @returns The possible swap steps for this pair of tokens
   */
  public static buildSwapStepsFromTokens(from: Token, to: Token): SwapStep[] {
    throw new Error('Method not implemented.')
  }
}
