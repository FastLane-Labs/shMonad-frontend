import { useState, useEffect, useCallback } from 'react'
import { useSwapContext } from '@/context/SwapContext'
import { BaseSwapService } from '@/services/baseSwap'
import { SwapPathService } from '@/services/swapPath'
import { useAccount } from 'wagmi'
import { Exchange } from '@/constants'
import { formatBalance, toBigInt } from '@/utils/format'

export const useBaselineQuote = () => {
  const { fromToken, fromAmount, toToken, toAmount, setToAmount, setFromAmount, setQuoteLoading, swapDirection } =
    useSwapContext()
  const { chainId } = useAccount()
  const [isQuoteLoading, setIsQuoteLoading] = useState(false)

  const baselineSwapService = new BaseSwapService()
  const swapPathService = new SwapPathService()

  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken || !chainId) return

    const relevantAmount = swapDirection === 'sell' ? fromAmount : toAmount
    if (!relevantAmount) return

    setIsQuoteLoading(true)
    setQuoteLoading(true)

    try {
      // Convert relevant amount to bigint
      const relevantAmountBigInt = toBigInt(
        relevantAmount,
        swapDirection === 'sell' ? fromToken.decimals : toToken.decimals
      )

      // Get swap routes
      const swapRoutes = await swapPathService.getSwapRoutes(fromToken, toToken, chainId, Exchange.UNISWAPV3)
      // Get best quote

      const swap =
        swapDirection === 'sell'
          ? await baselineSwapService.getBestQuoteExactIn(relevantAmountBigInt, swapRoutes)
          : await baselineSwapService.getBestQuoteExactOut(relevantAmountBigInt, swapRoutes)

      if (swap) {
        if (swapDirection === 'sell') {
          setToAmount(formatBalance(swap.amountOut, toToken.decimals))
        } else {
          setFromAmount(formatBalance(swap.amountIn, fromToken.decimals))
        }
      }
    } catch (error) {
      if (swapDirection === 'sell') {
        setToAmount(formatBalance(0n, toToken.decimals))
      } else {
        setFromAmount(formatBalance(0n, fromToken.decimals))
      }
      console.error('Fetching quote failed', error)
    } finally {
      setIsQuoteLoading(false)
      setQuoteLoading(false)
    }
  }, [fromToken, fromAmount, toToken, toAmount, swapDirection, chainId, setQuoteLoading, setFromAmount, setToAmount])

  useEffect(() => {
    fetchQuote()
  }, [fromToken, fromAmount, toToken, toAmount, swapDirection, chainId, fetchQuote])

  return { isQuoteLoading }
}
