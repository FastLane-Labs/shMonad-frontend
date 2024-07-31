import React, { useState, useEffect } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useBalance } from '@/hooks/useBalance'
import { useSwapContext } from '@/context/SwapContext'
import { toBigInt } from '@/utils/format'
import { SANCTIONED_ADDRESSES } from '@/constants'

interface SwapButtonProps {
  handleSwap: () => Promise<void>
  isLoading: boolean
}

const SwapButton: React.FC<SwapButtonProps> = ({ handleSwap, isLoading }) => {
  const { openConnectModal } = useConnectModal()
  const { fromToken, toToken, fromAmount } = useSwapContext()
  const { address: userAddress, status, isConnected } = useAccount()
  const [localLoading, setLocalLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [userBlocked, setUserBlocked] = useState(false)
  const { data: balance, isLoading: balanceLoading } = useBalance({ token: fromToken!, userAddress: userAddress! })

  useEffect(() => {
    if (status !== 'connecting') {
      setInitialized(true)
    }
  }, [status])

  useEffect(() => {
    setUserBlocked(SANCTIONED_ADDRESSES.includes(userAddress!))
  }, [userAddress])

  const handleClick = async () => {
    setLocalLoading(true)
    await handleSwap()
    setLocalLoading(false)
  }

  const hasSufficientBalance =
    balance && fromToken && toBigInt(fromAmount, fromToken.decimals) <= BigInt(balance.toString())

  if (!initialized) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Reconnecting to Wallet
      </button>
    )
  }

  if (userBlocked) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        You are not allowed to use this app
      </button>
    )
  } else if (!isConnected && status != 'reconnecting') {
    return (
      <button className='btn rounded-2xl w-full' onClick={() => openConnectModal?.()}>
        Connect wallet
      </button>
    )
  } else if (status === 'reconnecting') {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Reconnecting to Wallet
      </button>
    )
  } else if (!fromToken || !toToken) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Select a Token
      </button>
    )
  } else if (!fromAmount) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Enter an amount
      </button>
    )
  } else if (!hasSufficientBalance) {
    return (
      <button className='btn rounded-2xl w-full' disabled>
        Insufficient {fromToken.symbol} balance
      </button>
    )
  } else {
    return (
      <button
        className='btn rounded-2xl w-full'
        onClick={handleClick}
        disabled={isLoading || localLoading || balanceLoading}>
        {localLoading ? (
          <>
            <span className='loading loading-spinner'></span>Initiating swap
          </>
        ) : (
          'Swap'
        )}
      </button>
    )
  }
}

export default SwapButton
