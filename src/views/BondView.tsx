'use client'

import React, { useState } from 'react'
import SellComponent from '@/components/Swap/SellComponent'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useSwapProcessManager } from '@/hooks/useSwapProcessManager'
import BondUnbondButton from '@/components/Buttons/BondUnbondButton'
import MonadBalances from '@/components/WalletBalances/MonadBalances'
import PoliciesDropdown from '@/components/Buttons/PoliciesDropdown'

type Policy = 'Task Scheduler' | 'Atlas' | '4337 Bundling' | 'MEV Bundles' | ''

const BondingView: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [isBonding, setIsBonding] = useState<boolean>(true)
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

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <BondUnbondButton isBonding={isBonding} setIsBonding={setIsBonding} />
      <PoliciesDropdown selectedPolicy={selectedPolicy} setSelectedPolicy={setSelectedPolicy} />
      <div style={{ boxShadow: 'rgba(131, 110, 249, .1) 0px 5px 100px 4px' }} className='rounded-3xl'>
        {isBonding ? <MonadBalances state='Bond' /> : <MonadBalances state='Unbond' />}
        <div className='relative rounded-3xl bg-primary/45'>
          <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-3xl border border-accent'>
            {isBonding ? <SellComponent /> : <SellComponent />} {/* Render based on state */}
            <SwapButton handleSwap={handleSwap} isLoading={quoteLoading} />
            <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BondingView
