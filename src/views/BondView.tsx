'use client'

import React, { useState } from 'react'
import BondBalances from '@/components/WalletBalances/BondBalances'
import SellComponent from '@/components/Swap/SellComponent'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useSwapProcessManager } from '@/hooks/useSwapProcessManager'
import BondUnbondButton from '@/components/Buttons/BondUnbondButton'

const BondingView: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [isBonding, setIsBonding] = useState<boolean>(true)
  const { handleSwap } = useHandleSwap()
  const { quoteLoading } = useSwapProcessManager()

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <BondUnbondButton isBonding={isBonding} setIsBonding={setIsBonding} />
      <div style={{ boxShadow: 'rgba(131, 110, 249, .1) 0px 5px 100px 4px' }} className='rounded-3xl'>
        {<BondBalances />}
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
