import React, { useState, useEffect } from 'react'
import BuyAmount from './BuyAmount'
import { useTokenList } from '@/hooks/useTokenList'
import { useChainId } from 'wagmi'
import { Token } from '@/types'

interface BuyComponentProps {
  buyToken: string
  setBuyToken: (token: string) => void
  buyAmount: string
  setBuyAmount: (amount: string) => void
  address?: `0x${string}`
  quoteLoading: boolean
}

const BuyComponent: React.FC<BuyComponentProps> = ({
  buyToken,
  setBuyToken,
  buyAmount,
  setBuyAmount,
  address,
  quoteLoading,
}) => {
  const chainId = useChainId()
  console.log('chainId', chainId)
  const { tokens, loading, error } = useTokenList(chainId)
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)

  useEffect(() => {
    const token = tokens.find((t) => t.symbol === buyToken)
    setSelectedToken(token || null)
  }, [buyToken, tokens])

  const handleTokenSelect = (token: Token) => {
    setBuyToken(token.symbol)
    setSelectedToken(token)
  }

  return (
    <div className='input-card mb-4'>
      <div className='flex justify-between items-center mb-2 text-sm'>
        <span className='text-base-content'>To</span>
      </div>
      <BuyAmount
        buyToken={selectedToken}
        setBuyToken={handleTokenSelect}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        address={address}
        quoteLoading={quoteLoading}
      />
      {loading && <div>Loading tokens...</div>}
      {error && <div>Error loading tokens: {error.message}</div>}
    </div>
  )
}

export default BuyComponent
