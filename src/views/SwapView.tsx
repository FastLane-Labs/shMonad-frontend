import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import SellComponent from '@/components/Swap/SellComponent'
import BuyComponent from '@/components/Swap/BuyComponent'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import HandleAtlas from '@/components/Swap/HandleAtlas'
import { Settings } from '@/types'

const SwapView: React.FC = () => {
  const { address, isConnected } = useAccount()

  const [sellToken, setSellToken] = useState<string>('ETH')
  const [buyToken, setBuyToken] = useState<string>('')
  const [sellAmount, setSellAmount] = useState<string>('')
  const [buyAmount, setBuyAmount] = useState<string>('')
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [settings, setSettings] = useState<Settings>({
    slippageTolerance: 0.5,
    transactionDeadline: 20,
  })
  const [balance, setBalance] = useState<string>('0')
  const [decimals, setDecimals] = useState<number>(18)
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false)

  // Simulating quote fetching
  useEffect(() => {
    const fetchQuote = async () => {
      if (sellToken && sellAmount) {
        setQuoteLoading(true)
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setBuyAmount('100') // Dummy value
        setQuoteLoading(false)
      }
    }
    fetchQuote()
  }, [sellToken, sellAmount])

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  return (
    <div className='max-w-md mx-auto p-6 rounded-3xl'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Swap</h2>
        <SettingsButton settings={settings} setIsSettingsModalVisible={setIsSettingsModalVisible} />
      </div>

      <SellComponent
        sellToken={sellToken}
        setSellToken={setSellToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        address={address}
        balance={balance}
        setBalance={setBalance}
        decimals={decimals}
        sellTokenAddress={address} // This should be the actual token address
      />

      <FlipButton
        sellToken={sellToken}
        setSellToken={setSellToken}
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        sellAmount={sellAmount}
        setSellAmount={setSellAmount}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
      />

      <BuyComponent
        buyToken={buyToken}
        setBuyToken={setBuyToken}
        buyAmount={buyAmount}
        setBuyAmount={setBuyAmount}
        address={address}
        quoteLoading={quoteLoading}
      />

      <HandleAtlas
        sellToken={sellToken}
        buyToken={buyToken}
        sellAmount={sellAmount}
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
