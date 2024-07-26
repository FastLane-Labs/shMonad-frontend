import { publicClient } from '../../../wagmi.config'
import { Exchange } from './base'
import { SwapRoute, QuoteRequest, QuoteResult } from '@/types'
import { SwapType, CONTRACT_ADDRRESSES } from '@/constants'
import { QUOTERV2_ABI } from '@/constants/uniswap/v3/quoterV2'
import { Hex, ContractFunctionParameters, encodePacked } from 'viem'

enum QuoteFunctionName {
  quoteExactInputSingle = 'quoteExactInputSingle',
  quoteExactInput = 'quoteExactInput',
  quoteExactOutputSingle = 'quoteExactOutputSingle',
  quoteExactOutput = 'quoteExactOutput',
}

export class UniswapV3 extends Exchange {
  /**
   * inherited and overriden from Exchange
   */
  public static async getQuote(quoteRequest: QuoteRequest): Promise<QuoteResult | undefined> {
    const data = await publicClient.simulateContract(this.getQuoteContractCall(quoteRequest))
    return this.getFormattedQuoteResult(quoteRequest, data.result)
  }

  /**
   * inherited and overriden from Exchange
   */
  public static getFormattedQuoteResult(quoteRequest: QuoteRequest, result: any): QuoteResult {
    // All quote functions return a single uint256
    return {
      swapType: quoteRequest.swapType,
      amountIn: quoteRequest.swapType === SwapType.EXACT_IN ? quoteRequest.amount : BigInt(result),
      amountOut: quoteRequest.swapType === SwapType.EXACT_OUT ? quoteRequest.amount : BigInt(result),
      swapRoute: quoteRequest.swapRoute,
    }
  }

  /**
   * inherited and overriden from Exchange
   */
  public static getQuoteContractCall(quoteRequest: QuoteRequest): ContractFunctionParameters {
    return {
      address: CONTRACT_ADDRRESSES[quoteRequest.swapRoute.chainId].UNISWAPV3.quoter,
      abi: QUOTERV2_ABI,
      functionName: this._getQuoteFunctionName(quoteRequest),
      args: this._getQuoteFunctionParameters(quoteRequest),
    }
  }

  /**
   * Get the contract quote function name based on the swap type and swap steps
   * @param quoteRequest The quote request
   * @returns The quote function name
   */
  protected static _getQuoteFunctionName(quoteRequest: QuoteRequest): QuoteFunctionName {
    switch (quoteRequest.swapType) {
      case SwapType.EXACT_IN:
        return quoteRequest.swapRoute.swapSteps.length === 1
          ? QuoteFunctionName.quoteExactInputSingle
          : QuoteFunctionName.quoteExactInput
      case SwapType.EXACT_OUT:
        return quoteRequest.swapRoute.swapSteps.length === 1
          ? QuoteFunctionName.quoteExactOutputSingle
          : QuoteFunctionName.quoteExactOutput
    }
  }

  /**
   * Get the contract quote function parameters based on the swap type and swap steps
   * @param quoteRequest The quote request
   * @returns The quote function parameters
   */
  protected static _getQuoteFunctionParameters(quoteRequest: QuoteRequest): any[] {
    switch (this._getQuoteFunctionName(quoteRequest)) {
      case QuoteFunctionName.quoteExactInputSingle:
        // function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) public returns (uint256 amountOut)
        return [
          quoteRequest.swapRoute.swapSteps[0].tokenIn,
          quoteRequest.swapRoute.swapSteps[0].tokenOut,
          quoteRequest.swapRoute.swapSteps[0].extra.fee,
          quoteRequest.amount,
          0,
        ]

      case QuoteFunctionName.quoteExactInput:
        // function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut)
        return [this._computePath(quoteRequest.swapRoute), quoteRequest.amount]

      case QuoteFunctionName.quoteExactOutputSingle:
        // function quoteExactOutputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountOut, uint160 sqrtPriceLimitX96) public returns (uint256 amountIn)
        return [
          quoteRequest.swapRoute.swapSteps[0].tokenIn,
          quoteRequest.swapRoute.swapSteps[0].tokenOut,
          quoteRequest.swapRoute.swapSteps[0].extra.fee,
          quoteRequest.amount,
          0,
        ]

      case QuoteFunctionName.quoteExactOutput:
        // function quoteExactOutput(bytes path, uint256 amountOut) external returns (uint256 amountIn)
        return [this._computePath(quoteRequest.swapRoute), quoteRequest.amount]
    }
  }

  /**
   * Compute the path for the quoteExactInput and quoteExactOutput functions
   * @param route The swap route
   * @returns The path
   */
  protected static _computePath(route: SwapRoute): Hex {
    if (!route.swapSteps.length) {
      return '0x'
    }

    let types = ['address', 'uint24', 'address']
    let values = [route.swapSteps[0].tokenIn, route.swapSteps[0].extra.fee, route.swapSteps[0].tokenOut]

    for (let i = 1; i < route.swapSteps.length; i++) {
      types.push('uint24', 'address')
      values.push(route.swapSteps[i].extra.fee, route.swapSteps[i].tokenOut)
    }

    return encodePacked(types, values)
  }
}
