'use client'
import React, { useState, useEffect } from 'react'
import SellComponent from './SellComponent'
import BuyComponent from './BuyComponent'
import { useAccount } from 'wagmi'
import FlipButton from './FlipButton'
import SettingsModal from './SettingsModal'
import tokenList from '@/constants/tokenList.json'
import SettingsButton from './SettingsButton'
import HandleAtlas from './HandleAtlas'
import { Settings } from '@/types' // Adjust the path as necessary

const SwapCard: React.FC = () => {
  const { address } = useAccount()
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

  const getTokenDetails = (symbol: string) => {
    const token = tokenList.tokens.find((token) => token.symbol === symbol)
    return token || null
  }

  const tokenDetails = getTokenDetails(sellToken)

  const sellTokenAddress =
    (tokenDetails?.address as `0x${string}`) ?? ('0x0000000000000000000000000000000000000000' as `0x${string}`)
  const tokenDecimals = tokenDetails?.decimals ?? 18

  useEffect(() => {
    setDecimals(tokenDecimals)
  }, [sellToken, tokenDecimals])

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  useEffect(() => {
    const simulateQuote = async () => {
      if (!sellToken || !sellAmount) {
        setBuyAmount('')
        return
      }

      setQuoteLoading(true)

      try {
        setTimeout(() => {
          setBuyAmount('6969')
        }, 1000)
      } catch (error) {
        setBuyAmount('')
      } finally {
        setTimeout(() => {
          setQuoteLoading(false)
        }, 1000)
      }
    }

    simulateQuote()
  }, [sellToken, sellAmount, buyToken])

  if (!address) {
    return <div>Please connect your wallet to continue.</div>
  }

  return (
    <div className='relative max-w-md mx-auto p-6 rounded-3xl'>
      <div className='flex justify-between items-center'>
        <h2 className='btn bg-base-100 hover:bg-base-100 mb-2 rounded-xl w-24 text-center border border-secondary text-base-300 cursor-default hover:border-secondary'>
          Exchange
        </h2>
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
        sellTokenAddress={sellTokenAddress}
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

export default SwapCard
