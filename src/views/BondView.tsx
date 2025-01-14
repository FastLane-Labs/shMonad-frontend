'use client'

import { useState, useEffect } from 'react'
import SellComponent from '@/components/Swap/SellComponent'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useSwapProcessManager } from '@/hooks/useSwapProcessManager'
import BondUnbondButton from '@/components/Buttons/BondUnbondButton'
import MonadBalances from '@/components/WalletBalances/MonadBalances'
import PoliciesDropdown from '@/components/Buttons/PoliciesDropdown'
import { useSwapStateContext } from '@/context/SwapStateContext'

type Policy = 'Task Scheduler' | 'Atlas' | '4337 Bundling' | 'MEV Bundles' | ''

const BondingView: React.FC = () => {
  const { appState, setAppState } = useSwapStateContext()
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy>('')
  const { handleSwap } = useHandleSwap()
  const { quoteLoading } = useSwapProcessManager()

  const handleAction = () => {
    if (!selectedPolicy) {
      alert('Please select a policy before proceeding.')
      return
    }
    handleSwap()
  }

  useEffect(() => {
    setAppState('Bond')
  }, [])

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <BondUnbondButton />
      <PoliciesDropdown selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
      <div style={{ boxShadow: 'rgba(131, 110, 249, .1) 0px 5px 100px 4px' }} className='rounded-3xl'>
        <MonadBalances />
        <div className='relative rounded-3xl bg-primary/45'>
          <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-3xl border border-accent'>
            {appState === 'Bond' ? <SellComponent /> : <SellComponent />}
            <SwapButton handleSwap={handleSwap} isLoading={quoteLoading} />
            <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BondingView
