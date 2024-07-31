import { useState, useEffect, useCallback } from 'react'
import { useSwapContext } from '@/context/SwapContext'
import { BaseSwapService } from '@/services/baseSwap'
import { SwapPathService } from '@/services/swapPath'
import { useAccount } from 'wagmi'
import { Exchange, SwapType } from '@/constants'
import { formatBalance, toBigInt } from '@/utils/format'

export const useBaselineQuote = () => {
  const { fromToken, fromAmount, toToken, setToAmount, setQuoteLoading } = useSwapContext()
  const { chainId } = useAccount()
  const [isQuoteLoading, setIsQuoteLoading] = useState(false)
  const baselineSwapService = new BaseSwapService()
  const swapPathService = new SwapPathService()

  const fetchQuote = useCallback(async () => {
    if (!fromToken || !fromAmount || !toToken || !chainId) return

    setIsQuoteLoading(true)
    setQuoteLoading(true)
    try {
      // Convert fromAmount to bigint
      const fromAmountBigInt = toBigInt(fromAmount, fromToken.decimals)
      // Get swap routes
      console.log('fromToken', fromToken.symbol)
      console.log('toToken', toToken.symbol)
      console.log('chainId', chainId)

      console.log('fromAmountBigInt', fromAmountBigInt)
      console.log('fromAmount', fromAmount)
      console.log('fromAmountDecimals', fromToken.decimals)

      const swapRoutes = await swapPathService.getSwapRoutes(fromToken, toToken, chainId, Exchange.UNISWAPV3)
      // Get best quote
      console.log('swapRoutes', swapRoutes)
      const swap = await baselineSwapService.getBestQuoteExactIn(fromAmountBigInt, swapRoutes)

      if (swap) {
        setToAmount(formatBalance(swap.amountOut, toToken.decimals))
      }
    } catch (error) {
      setToAmount(formatBalance(0n, toToken.decimals))
      console.error('Fetching quote failed', error)
    } finally {
      setIsQuoteLoading(false)
      setQuoteLoading(false)
    }
  }, [fromToken, fromAmount, toToken])

  useEffect(() => {
    fetchQuote()
  }, [fromToken, fromAmount, toToken, fetchQuote])

  return { isQuoteLoading }
}
