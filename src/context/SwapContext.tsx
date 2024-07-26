import React, { createContext, useContext } from 'react'
import { useSwap } from '@/hooks/useSwap'

const SwapContext = createContext<ReturnType<typeof useSwap> | null>(null)

export const SwapProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const swapState = useSwap()

  return <SwapContext.Provider value={swapState}>{children}</SwapContext.Provider>
}

export const useSwapContext = () => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('useSwapContext must be used within a SwapProvider')
  }
  return context
}
