import { useState, useEffect, useCallback } from 'react'
import { SwapDirection, Token } from '@/types'
import { useCurrentTokenList } from './useTokenList'
import { useAccount } from 'wagmi'
import { toBigInt } from '@/utils/format'
import useAllowance from '@/hooks/useAllowance'
import { useFastLaneOnline } from './useFastLaneOnline'

interface SwapState {
  // Token and Amount States
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string

  // Quote States
  quote: any
  quoteLoading: boolean

  // Allowance States
  allowance: bigint
  sufficientAllowance: boolean
  allowanceLoading: boolean

  // Swap Direction
  swapDirection: SwapDirection

  // State Setters
  setSwapDirection: (direction: SwapDirection) => void
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setQuote: (quote: any) => void
  setQuoteLoading: (loading: boolean) => void
  setSufficientAllowance: (sufficientAllowance: boolean) => void

  // Actions
  swapTokens: () => void
  resetSelections: () => void
  updateAllowance: () => void
}

export const useSwap = (): SwapState => {
  const { chainId } = useAccount()
  const { tokens } = useCurrentTokenList()

  const [defaultToken, setDefaultToken] = useState<Token | null>(
    tokens.find((token) => token.tags?.includes('default')) as Token
  )

  const [fromToken, setFromToken] = useState<Token | null>(defaultToken)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sell')
  const [quote, setQuote] = useState<any>(null)
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<bigint>(BigInt(0))
  const [sufficientAllowance, setSufficientAllowance] = useState<boolean>(false)
  const [allowanceLoading, setAllowanceLoading] = useState<boolean>(false)
  const [allowanceRefreshTrigger, setAllowanceRefreshTrigger] = useState(0)

  const { address: userAddress } = useAccount()

  // fastlane online contract address
  const spenderAddress = useFastLaneOnline()

  const {
    allowance: fetchedAllowance,
    sufficientAllowance: fetchedSufficientAllowance,
    loading: fetchedAllowanceLoading,
  } = useAllowance({
    token: fromToken!,
    userAddress: userAddress!,
    spenderAddress: spenderAddress,
    requiredAmount: toBigInt(fromAmount, fromToken?.decimals ?? 0),
    refreshTrigger: allowanceRefreshTrigger,
  })

  const updateAllowance = useCallback(() => {
    setAllowanceLoading(true)
    setAllowanceRefreshTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (chainId && tokens.length > 0) {
      resetSelections()
      setDefaultToken(tokens.find((token) => token.tags?.includes('default')) as Token)
      setFromToken(defaultToken)
    }
  }, [chainId])

  useEffect(() => {
    setAllowance(fetchedAllowance ?? BigInt(0))
    setSufficientAllowance(fetchedSufficientAllowance ?? false)
    setAllowanceLoading(fetchedAllowanceLoading)
  }, [fetchedAllowance, fetchedSufficientAllowance, fetchedAllowanceLoading])

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }, [fromToken, toToken, fromAmount, toAmount])

  const resetSelections = useCallback(() => {
    setFromToken(null)
    setToToken(null)
    setFromAmount('')
    setToAmount('')
    setQuote(null)
    setAllowance(BigInt(0))
    setSufficientAllowance(false)
  }, [])

  useEffect(() => {
    resetSelections()
  }, [chainId, resetSelections])

  useEffect(() => {
    // Update allowance when fromToken or fromAmount changes
    if (fromToken && userAddress) {
      updateAllowance()
    }
  }, [fromToken, fromAmount, userAddress, updateAllowance])

  return {
    // Token and Amount States
    fromToken,
    toToken,
    fromAmount,
    toAmount,

    // Quote States
    quote,
    quoteLoading,

    // Allowance States
    allowance,
    sufficientAllowance,
    allowanceLoading,

    // Swap Direction
    swapDirection,

    // State Setters
    setSwapDirection,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuote,
    setQuoteLoading,
    setSufficientAllowance,

    // Actions
    swapTokens: handleSwapTokens,
    resetSelections,
    updateAllowance,
  }
}
