import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import SellComponent from '@/components/Swap/SellComponent'
import BuyComponent from '@/components/Swap/BuyComponent'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import HandleAtlas from '@/components/Swap/HandleAtlas'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { Settings } from '@/types'
import { useSwapContext } from '@/context/SwapContext'

const SwapView: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { fromToken, fromAmount, toToken, setToAmount, setQuoteLoading } = useSwapContext()

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
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <div
        className='relative rounded-3xl'
        style={{
          background: 'rgba(0, 0, 0, .3)',
        }}>
        <div
          className='relative max-w-md mx-auto p-4 rounded-3xl border border-accent'
          style={{
            background: 'linear-gradient(290deg, rgba(241,35,121, .1) 10%, rgba(7, 76, 255 , .1) 100%)',
            boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px',
          }}>
          <div className='flex justify-end items-center mb-2'>
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
      </div>
    </div>
  )
}

export default SwapView
