import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { ethers } from 'ethers'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useAccount } from 'wagmi'
import { useCurrentTokenList } from '@/hooks/useTokenList'
import { useBalance } from '@/hooks/useBalance'
import { Token } from '@/types'
import { useTokenUsdPrice } from '@/hooks/useTokenUsdPrice'
import { Connect } from '../Navbar/Connect'
import SettingsButton from '../Buttons/SettingsButton'
import SettingsModal from '../Modals/SettingsModal'

const MonadBalances: React.FC = () => {
  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    toToken: buyToken,
    fromAmount: sellAmount,
    setFromAmount: setSellAmount,
    setSwapDirection,
    isQuoteing,
    appState,
  } = useSwapStateContext()

  const { address, chainId } = useAccount()
  const { tokens } = useCurrentTokenList()

  const {
    data: fetchedBalance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useBalance({
    token: sellToken as Token,
    userAddress: address as string,
    enabled: !!sellToken && !!address,
  })

  const { data: tokenPrice } = useTokenUsdPrice(sellToken)

  const usdValue = useMemo(() => {
    if (!tokenPrice || tokenPrice === 0 || !sellAmount || sellAmount === '') return null
    const amount = parseFloat(sellAmount)
    return isNaN(amount) ? null : amount * tokenPrice
  }, [tokenPrice, sellAmount])

  useEffect(() => {
    if (chainId && !sellToken && tokens.length > 0) {
      const defaultToken = tokens.find((token) => token.tags?.includes('default'))
      if (defaultToken && defaultToken.chainId === chainId && defaultToken.address !== buyToken?.address) {
        setSellToken(defaultToken)
      }
    }
  }, [chainId, sellToken, tokens, setSellToken, buyToken])

  const balance = useMemo(() => {
    if (sellToken && !balanceLoading && !balanceError && fetchedBalance !== undefined) {
      return ethers.formatUnits(fetchedBalance, sellToken.decimals)
    }
    return '0'
  }, [fetchedBalance, sellToken, balanceLoading, balanceError])

  return (
    <div className='relative rounded-t-3xl bg-base-200/10 -mb-16'>
      <div className='gradient-bg-50 relative max-w-md mx-auto p-4 rounded-t-3xl pb-20 border-t border-x border-accent'>
        <div className='text-white px-2'>
          <div className='pt-2 flex justify-between item-center'>
            <div>
              <span className='text-xs'>Available to {appState}: </span>
              <div className='text-lg font-bold'>
                <TokenBalance token={sellToken || undefined} toFixed={3} />
                <span> DMON</span>
              </div>
            </div>
            <Connect chainStatus={'none'} />
          </div>

          <div className='line-seperator-sm mt-2' />

          <div className='pt-2'>
            <span className='text-xs'>SHMONAD Balance: </span>
            <div className='text-lg font-bold'>
              {/* <TokenBalance token={sellToken || undefined} toFixed={3} /> */}
              10
              <span> SHMON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonadBalances
