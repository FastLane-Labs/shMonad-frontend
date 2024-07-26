import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import SellComponent from '@/components/Swap/SellComponent'
import BuyComponent from '@/components/Swap/BuyComponent'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import HandleAtlas from '@/components/Swap/HandleAtlas'
import { Settings } from '@/types'
import { useSwapContext } from '@/context/SwapContext'

const SwapView: React.FC = () => {
  const { address, isConnected } = useAccount()
  const {
    fromToken,
    setFromToken,
    fromAmount,
    setFromAmount,
    toToken,
    setToToken,
    toAmount,
    setToAmount,
    quoteLoading,
    setQuoteLoading,
    balance,
    setBalance,
    decimals,
  } = useSwapContext()

  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [settings, setSettings] = useState<Settings>({
    slippageTolerance: 0.5,
    transactionDeadline: 20,
  })

  // Simulating quote fetching
  useEffect(() => {
    const fetchQuote = async () => {
      if (fromToken && fromAmount) {
        setQuoteLoading(true)
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setToAmount('100') // Dummy value, replace with actual quote logic
        setQuoteLoading(false)
      }
    }
    fetchQuote()
  }, [fromToken, fromAmount, setToAmount, setQuoteLoading])

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  return (
    <div className='max-w-md mx-auto p-6 rounded-3xl'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Swap</h2>
        <SettingsButton settings={settings} setIsSettingsModalVisible={setIsSettingsModalVisible} />
      </div>

      <SellComponent />
      <FlipButton />
      <BuyComponent />

      <HandleAtlas
        sellToken={fromToken?.symbol || ''}
        buyToken={toToken?.symbol || ''}
        sellAmount={fromAmount}
        slippageTolerance={settings.slippageTolerance}
        transactionDeadline={settings.transactionDeadline}
      />

      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={() => setIsSettingsModalVisible(false)}
        onSave={handleSettingsSave}
      />
    </div>
  )
}

export default SwapView
