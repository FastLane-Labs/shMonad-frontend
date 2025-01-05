import { useState, useEffect, useMemo } from 'react'
import { ethers } from 'ethers'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import { TokenBalance } from '@/components/TokenBalance/TokenBalance'
import { useSwapStateContext } from '@/context/SwapStateContext'
import { useAccount } from 'wagmi'
import { useCurrentTokenList } from '@/hooks/useTokenList'
import { useBalance } from '@/hooks/useBalance'
import { Token } from '@/types'
import { useTokenUsdPrice } from '@/hooks/useTokenUsdPrice'

const WalletBalances: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)

  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    toToken: buyToken,
    fromAmount: sellAmount,
    setFromAmount: setSellAmount,
    setSwapDirection,
    isQuoteing,
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

  const handleSetMax = () => {
    if (balance) {
      setSellAmount(balance)
      setSwapDirection('sell')
    }
  }
  return (
    <div
      className='relative rounded-t-3xl bg-base-200/30 -mb-5'
      // style={{ boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px' }}
    >
      <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-t-3xl pb-9 border-t border-x border-accent'>
        <div className='flex justify-between items-center mb-2 space-x-2'>
          <div className='flex w-full space-x-2'>
            <button className='btn btn-menu !w-2/5'>Mint</button>
            <button className='btn btn-menu !w-2/5'>Bond / Unbond</button>
          </div>
          <SettingsButton setIsSettingsModalVisible={setIsSettingsModalVisible} />
        </div>
        <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
        <div className=''>
          <div className='pt-2'>
            <span className='text-xs'>Available to Mint: </span>
            <div className='text-lg font-extrabold'>
              <TokenBalance token={sellToken || undefined} toFixed={3} />
              <span> MONAD</span>
            </div>
          </div>
          <div className='line-seperator-sm mt-2' />

          <div className='pt-2'>
            <span className='text-xs'>SHMONAD Balance: </span>
            <div className='text-lg font-extrabold'>
              <TokenBalance token={sellToken || undefined} toFixed={3} />
              <span> SHMONAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletBalances
