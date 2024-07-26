import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import SellComponent from '@/components/Swap/SellComponent'
import BuyComponent from '@/components/Swap/BuyComponent'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import HandleAtlas from '@/components/Swap/HandleAtlas'
import { Settings } from '@/types'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import SwapButton from '@/components/Buttons/SwapButton'

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
            // background: 'linear-gradient(293deg, rgba(190, 5, 255, .1) 18.05%, rgba(7, 76, 255, .1) 99.54%)',
            background: 'linear-gradient(290deg, rgba(241,35,121, .1) 10%, rgba(7, 76, 255 , .1) 100%)',
            boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px', // red
            // boxShadow: 'rgba(243, 160, 66, 0.3) 0px 4px 100px 0px', // orange
          }}>
          <div className='flex justify-end items-center mb-2'>
            {/* <h2 className='btn bg-base-100 hover:bg-base-100 mb-2 rounded-xl w-24 text-center border border-secondary text-base-300 cursor-default hover:border-secondary'>
          Exchange
        </h2> */}
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
          {/* <SwapButton sellAmount={sellAmount} buyToken={buyToken} /> */}
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
