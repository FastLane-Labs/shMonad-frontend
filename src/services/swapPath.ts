import { TokenProvider } from '@/providers/StaticTokenListProvider'
import { ChainId, Exchange, nativeEvmTokenAddress, TOKEN_ADDRESSES } from '@/constants'
import { Token, SwapStep, SwapRoute } from '@/types'
import { getExchange } from '@/services/exchanges'
import { tokenCmp } from '@/utils/token'
import { Address } from 'viem'

interface ISwapPathService {
  getSwapRoutes(from: Token, to: Token, exchange: Exchange): Promise<SwapRoute[]>
}

export class SwapPathService implements ISwapPathService {
  protected nativeToken: Token = {} as Token
  protected wrappedNativeToken: Token = {} as Token
  protected gatewayToken: Token = {} as Token
  protected tokens: Map<Address, Token> = new Map()

  constructor(protected chainId: ChainId) {}

  /**
   * Load tokens for the chain ID set in the constructor
   * @throws If the native, wrapped native token or gateway token are not found
   */
  async loadTokens() {
    const tokens = await TokenProvider.getTokensByChainId(this.chainId)
    tokens.forEach((token) => {
      this.tokens.set(token.address, token)
    })

    const nativeToken = this.tokens.get(nativeEvmTokenAddress)
    if (!nativeToken) {
      throw new Error('Native token not found for chain ID ' + this.chainId)
    }

    const wrappedNativeToken = this.tokens.get(TOKEN_ADDRESSES[this.chainId].wrappedNative)
    if (!wrappedNativeToken) {
      throw new Error('Wrapped native token not found for chain ID ' + this.chainId)
    }

    const gatewayToken = this.tokens.get(TOKEN_ADDRESSES[this.chainId].bestGateway)
    if (!gatewayToken) {
      throw new Error('Gateway token not found for chain ID ' + this.chainId)
    }

    this.nativeToken = nativeToken
    this.wrappedNativeToken = wrappedNativeToken
    this.gatewayToken = gatewayToken
  }

  /**
   * Get swap routes for a pair of tokens and an exchange
   * @param from The token to swap from
   * @param to The token to swap to
   * @param _exchange The exchange to use
   * @returns The swap routes
   * @throws If the tokens are not found or are the same
   */
  async getSwapRoutes(from: Token, to: Token, _exchange: Exchange): Promise<SwapRoute[]> {
    if (!this.wrappedNativeToken.address) {
      await this.loadTokens()
    }

    if (tokenCmp(from, this.nativeToken)) {
      from = this.wrappedNativeToken
    }

    if (tokenCmp(to, this.nativeToken)) {
      to = this.wrappedNativeToken
    }

    if (!this.tokens.has(from.address)) {
      throw new Error('getSwapRoutes: token not found: ' + from.address)
    }

    if (!this.tokens.has(to.address)) {
      throw new Error('getSwapRoutes: token not found: ' + to.address)
    }

    if (tokenCmp(from, to)) {
      throw new Error('getSwapRoutes: from and to tokens are the same')
    }

    const exchange = getExchange(_exchange)
    let swapRoutes: SwapRoute[] = []

    // Add direct routes
    for (const swapStep of exchange.buildSwapStepsFromTokens(from, to)) {
      swapRoutes.push({
        chainId: this.chainId,
        exchange: _exchange,
        swapSteps: [swapStep],
      })
    }

    if (!tokenCmp(from, this.wrappedNativeToken) && !tokenCmp(to, this.wrappedNativeToken)) {
      // Swap from/to non-wrapped native token: add gateway swap routes

      // Add wrapped native token as intermediate token
      swapRoutes.push(
        ...this.buildRoutesFromStepsCombination(
          _exchange,
          exchange.buildSwapStepsFromTokens(from, this.wrappedNativeToken),
          exchange.buildSwapStepsFromTokens(this.wrappedNativeToken, to)
        )
      )

      if (!tokenCmp(from, this.gatewayToken) && !tokenCmp(to, this.gatewayToken)) {
        // Swap from/to non-gateway token: add gateway token as intermediate token

        // Add gateway token as intermediate token
        swapRoutes.push(
          ...this.buildRoutesFromStepsCombination(
            _exchange,
            exchange.buildSwapStepsFromTokens(from, this.gatewayToken),
            exchange.buildSwapStepsFromTokens(this.gatewayToken, to)
          )
        )
      }
    }

    return swapRoutes
  }

  /**
   * Build swap routes from two sets of swap steps
   * @param exchange The exchange to use
   * @param steps1 The first set of swap steps
   * @param steps2 The second set of swap steps
   * @returns The swap routes
   */
  protected buildRoutesFromStepsCombination(exchange: Exchange, steps1: SwapStep[], steps2: SwapStep[]): SwapRoute[] {
    let routes: SwapRoute[] = []

    for (const step1 of steps1) {
      for (const step2 of steps2) {
        routes.push({
          chainId: this.chainId,
          exchange: exchange,
          swapSteps: [step1, step2],
        })
      }
    }

    return routes
  }
}
