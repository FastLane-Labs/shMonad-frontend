import { useEffect, useMemo, useCallback } from 'react'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useAccount } from 'wagmi'
import { formatBalance } from '@/utils/format'
import useDebounce from '@/hooks/useDebounce'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useFastLaneAddresses } from './useFastLaneAddresses'
import { useAppStore } from '@/store/useAppStore'
import { useBaselineQuote } from './useBaselineQuote'
import { useSwapCallData } from './useSwapCallData'

export const useSwapProcessManager = () => {
  const {
    fromToken,
    fromAmount,
    toToken,
    toAmount,
    setToAmount,
    setFromAmount,
    setQuoteLoading,
    swapDirection,
    setQuote,
    setSwapData,
  } = useSwapStateContext()
  const { address, chainId } = useAccount()
  const { provider } = useEthersProviderContext()
  const { atlasAddress, dappAddress, atlasVerificationAddress } = useFastLaneAddresses()
  const { config } = useAppStore()

  const debouncedAmount = useDebounce(swapDirection === 'sell' ? fromAmount : toAmount, 500)

  const isQuoteReady = useMemo(() => {
    return Boolean(fromToken && toToken && chainId && debouncedAmount)
  }, [fromToken, toToken, chainId, debouncedAmount])

  const isSwapDataReady = useMemo(() => {
    return Boolean(isQuoteReady && provider && atlasAddress && dappAddress && atlasVerificationAddress)
  }, [isQuoteReady, provider, atlasAddress, dappAddress, atlasVerificationAddress])

  const {
    data: quoteResult,
    isLoading: quoteLoading,
    error: quoteError,
  } = useBaselineQuote(address, fromToken, toToken, swapDirection, debouncedAmount, chainId, isQuoteReady)

  const {
    data: swapDataResult,
    isLoading: swapDataLoading,
    error: swapDataError,
  } = useSwapCallData(
    address,
    fromToken,
    toToken,
    swapDirection,
    debouncedAmount,
    quoteResult,
    isSwapDataReady && Boolean(quoteResult),
    provider,
    atlasAddress,
    dappAddress,
    atlasVerificationAddress,
    config,
    chainId
  )

  const updateQuoteLoading = useCallback(() => {
    setQuoteLoading(isQuoteReady && quoteLoading)
  }, [isQuoteReady, quoteLoading, setQuoteLoading])

  const updateQuoteResult = useCallback(() => {
    if (quoteResult && fromToken && toToken) {
      setQuote(quoteResult)
      if (swapDirection === 'sell') {
        setToAmount(formatBalance(quoteResult.amountOut, toToken.decimals))
      } else {
        setFromAmount(formatBalance(quoteResult.amountIn, fromToken.decimals))
      }
    } else if (quoteError) {
      console.error('Error fetching quote:', quoteError)
      setQuoteLoading(false)
      if (fromToken && toToken) {
        if (swapDirection === 'sell') {
          setToAmount(formatBalance(0n, toToken.decimals))
        } else {
          setFromAmount(formatBalance(0n, fromToken.decimals))
        }
      }
    }
  }, [
    quoteResult,
    quoteError,
    fromToken,
    toToken,
    swapDirection,
    setToAmount,
    setFromAmount,
    setQuoteLoading,
    setQuote,
  ])

  const updateSwapData = useCallback(() => {
    if (swapDataResult) {
      setSwapData(swapDataResult)
    } else if (swapDataError) {
      console.error('Error generating swap data:', swapDataError)
      setSwapData(null)
    }
  }, [swapDataResult, swapDataError, setSwapData])

  useEffect(() => {
    updateQuoteLoading()
  }, [updateQuoteLoading])

  useEffect(() => {
    updateQuoteResult()
  }, [updateQuoteResult])

  useEffect(() => {
    updateSwapData()
  }, [updateSwapData])

  return {
    quoteLoading,
    swapDataLoading,
    quoteError,
    swapDataError,
  }
}
