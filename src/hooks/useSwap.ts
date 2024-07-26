import { useState, useEffect, useCallback, useMemo } from 'react'
import { useChainId } from 'wagmi'
import { Token } from '@/types'

interface SwapState {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  quoteLoading: boolean
  balance: string
  decimals: number
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setQuoteLoading: (loading: boolean) => void
  setBalance: (balance: string) => void
  setDecimals: (decimals: number) => void
  swapTokens: () => void
  resetSelections: () => void
}

export const useSwap = (): SwapState => {
  const chainId = useChainId()
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)
  const [balance, setBalance] = useState<string>('0')
  const [decimals, setDecimals] = useState<number>(18)

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
  }, [])

  useEffect(() => {
    resetSelections()
  }, [chainId, resetSelections])

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    quoteLoading,
    balance,
    decimals,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuoteLoading,
    setBalance,
    setDecimals,
    swapTokens: handleSwapTokens,
    resetSelections,
  }
}
