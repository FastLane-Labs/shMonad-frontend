import { useState, useEffect, useCallback, useMemo } from 'react'
import { QuoteResultWithPriceImpact, SwapCallData, SwapDirection, SwapMode, SwapResult, Token } from '@/types'
import { useCurrentTokenList } from './useTokenList'
import { useAccount } from 'wagmi'
import { toBigInt } from '@/utils/format'
import useDebounce from '@/hooks/useDebounce'
import { useAllowanceManager } from './useAllowanceManager'
import { nativeEvmTokenAddress } from '@/constants'
import { useFastLaneAddresses } from './useFastLaneAddresses'

export interface SwapState {
  // App State
  isBonding: boolean
  isMinting: boolean
  appState: string

  // Token States
  fromToken: Token | null
  toToken: Token | null
  nativeToken: Token | null

  // Amount States
  fromAmount: string
  toAmount: string

  // Swap Configuration
  swapDirection: SwapDirection

  // Quote States
  quote: QuoteResultWithPriceImpact | null
  isQuoteing: boolean
  allowQuoteUpdate: boolean

  // New property
  discardNextQuoteUpdate: boolean

  // Swap Data
  swapData: SwapCallData | null
  swapResult: SwapResult | null
  swapMode: SwapMode | 'swap' | 'mint' | 'bond' | 'unbond'

  // Allowance State
  hasSufficientAllowance: boolean

  // Progress States
  isApproving: boolean
  isSwapping: boolean
  isSigning: boolean
  hasUserOperationSignature: boolean

  // State Setters
  setIsBonding: (isBonding: boolean) => void
  setIsMinting: (isMinting: boolean) => void
  setAppState: (appState: 'Mint' | 'Bond' | 'Unbond') => void
  setFromToken: (token: Token | null) => void
  setToToken: (token: Token | null) => void
  setFromAmount: (amount: string) => void
  setToAmount: (amount: string) => void
  setSwapDirection: (direction: SwapDirection) => void
  setQuote: (quote: QuoteResultWithPriceImpact | null) => void
  setIsQuoteing: (isQuoteing: boolean) => void
  setAllowQuoteUpdate: (allowQuoteUpdate: boolean) => void
  setSwapData: (data: SwapCallData | null) => void
  setSwapResult: (result: SwapResult | null) => void
  setIsApproving: (isApproving: boolean) => void
  setIsSwapping: (isSwapping: boolean) => void
  setIsSigning: (isSigning: boolean) => void
  setHasUserOperationSignature: (hasUserOperationSignature: boolean) => void
  setSwapDataSigned: (isSigned: boolean) => void
  resetSwapData: () => void
  // New setter
  setDiscardNextQuoteUpdate: (discard: boolean) => void

  // Actions
  swapTokens: () => void
  resetSelections: () => void

  // Allowance functions
  checkAllowance: (token: Token, userAddress: string, spenderAddress: string) => Promise<bigint>
  updateAllowance: (token: Token, spenderAddress: string, amount: bigint) => Promise<boolean>
}

export const useSwapState = (): SwapState => {
  //  App State
  const [isBonding, setIsBonding] = useState<boolean>(false)
  const [isMinting, setIsMinting] = useState<boolean>(true)
  const [appState, setAppState] = useState<'Mint' | 'Bond' | 'Unbond'>('Mint')

  // External hooks and derived values
  const { chainId, address: userAddress } = useAccount()
  const { tokens } = useCurrentTokenList()
  const { atlasAddress } = useFastLaneAddresses()
  const allowanceManager = useAllowanceManager()

  // Derived token values
  const defaultToken = useMemo(() => tokens.find((token) => token.tags?.includes('default')) as Token | null, [tokens])
  const nativeToken = useMemo(
    () => tokens.find((token) => token.address === nativeEvmTokenAddress) as Token | null,
    [tokens]
  )

  // Token states
  const [fromToken, setFromToken] = useState<Token | null>(() => defaultToken)
  const [toToken, setToToken] = useState<Token | null>(null)

  // Amount states
  const [fromAmount, setFromAmount] = useState<string>('')
  const [toAmount, setToAmount] = useState<string>('')
  const debouncedFromAmount = useDebounce(fromAmount, 500) // 500ms delay

  // Swap configuration
  const [swapDirection, setSwapDirection] = useState<SwapDirection>('sell')

  // Quote states
  const [quote, setQuote] = useState<QuoteResultWithPriceImpact | null>(null)
  const [isQuoteing, setIsQuoteing] = useState<boolean>(false)
  const [allowQuoteUpdate, setAllowQuoteUpdate] = useState<boolean>(true)

  // New state for discarding next quote update
  const [discardNextQuoteUpdate, setDiscardNextQuoteUpdate] = useState<boolean>(false)

  // Swap data and result
  const [swapData, setSwapData] = useState<SwapCallData | null>(null)
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null)

  // Progress states
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [hasUserOperationSignature, setHasUserOperationSignature] = useState<boolean>(false)

  // Allowance state
  const [hasSufficientAllowance, setHasSufficientAllowance] = useState<boolean>(false)

  const swapMode = useMemo(() => {
    if (quote?.swapType === 'WRAP') {
      return 'wrap'
    } else if (quote?.swapType === 'UNWRAP') {
      return 'unwrap'
    }
    return appState.toLowerCase() as SwapMode
  }, [appState])

  useEffect(() => {
    const checkAllowance = async () => {
      if (!fromToken || !userAddress || !debouncedFromAmount || !quote) {
        setHasSufficientAllowance(false)
        return
      }

      let spenderAddress: string
      let tokenToCheck: Token

      if (quote.swapType === 'WRAP') {
        spenderAddress = quote.swapRoute.swapSteps[0].tokenOut.address
        tokenToCheck = fromToken
      } else if (quote.swapType === 'UNWRAP') {
        spenderAddress = quote.swapRoute.swapSteps[0].tokenIn.address
        tokenToCheck = toToken!
      } else {
        spenderAddress = atlasAddress
        tokenToCheck = fromToken
      }

      // Skip allowance check for native token
      if (tokenToCheck.address === nativeEvmTokenAddress) {
        setHasSufficientAllowance(true)
        return
      }

      const requiredAmount = toBigInt(debouncedFromAmount, tokenToCheck.decimals)
      const isAllowanceSufficient = await allowanceManager.isSufficientAllowance(
        tokenToCheck,
        userAddress,
        spenderAddress,
        requiredAmount
      )
      setHasSufficientAllowance(isAllowanceSufficient)
    }

    checkAllowance()
  }, [
    fromToken,
    toToken,
    userAddress,
    // atlasAddress,
    quote,
    debouncedFromAmount,
    allowanceManager,
    allowanceManager.isSufficientAllowance,
    allowanceManager.allowanceUpdateTrigger,
  ])

  const resetSelections = useCallback(() => {
    setFromToken(defaultToken)
    setToToken(null)
    setFromAmount('')
    setToAmount('')
    setQuote(null)
    setSwapData(null)
  }, [defaultToken])

  const resetSwapData = useCallback(() => {
    setQuote(null)
    setIsQuoteing(false)
    setSwapResult(null)
    setIsSwapping(false)
    setIsSigning(false)
    setHasUserOperationSignature(false)
  }, [])

  useEffect(() => {
    if (chainId && tokens.length > 0) {
      resetSelections()
    }
  }, [chainId, tokens, resetSelections])

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount])

  useEffect(() => {
    setSwapData(null)
  }, [fromToken, toToken, fromAmount, toAmount, swapDirection])

  const checkSignatureValidity = useCallback(() => {
    if (!swapData?.userOperation?.toStruct) {
      setHasUserOperationSignature(false)
      return
    }
    const signature = swapData.userOperation.toStruct().signature
    const isValid = signature !== undefined && signature !== '0x'
    setHasUserOperationSignature(isValid)
  }, [swapData])

  useEffect(() => {
    checkSignatureValidity()
  }, [checkSignatureValidity])

  const setSwapDataSigned = useCallback(
    (isSigned: boolean) => {
      setSwapData((prevData) => (prevData ? { ...prevData, isSigned } : null))
      if (isSigned) {
        checkSignatureValidity()
      }
    },
    [checkSignatureValidity]
  )

  return {
    // App State
    isBonding,
    setIsBonding,
    isMinting,
    setIsMinting,
    appState,
    setAppState,

    // Token and Amount States
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    nativeToken,
    // Quote States
    quote,
    isQuoteing,
    allowQuoteUpdate,
    discardNextQuoteUpdate,
    // Approve State
    isApproving,

    // Swap Direction
    swapDirection,

    // Swap Data
    swapData,
    hasUserOperationSignature,
    swapResult,
    swapMode,

    // Allowance State
    hasSufficientAllowance,

    // State Setters
    setSwapDirection,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setQuote,
    setAllowQuoteUpdate,
    setIsQuoteing,
    setSwapData,
    setSwapResult,
    setHasUserOperationSignature,
    setSwapDataSigned,
    setIsSigning,
    setIsSwapping,
    setIsApproving,
    resetSwapData,
    setDiscardNextQuoteUpdate,
    // Actions
    swapTokens: handleSwapTokens,
    resetSelections,

    // Allowance functions (from useAllowanceManager)
    checkAllowance: allowanceManager.checkAllowance,
    updateAllowance: allowanceManager.updateAllowance,

    // Swap Progress State
    isSwapping,
    isSigning,
  }
}
