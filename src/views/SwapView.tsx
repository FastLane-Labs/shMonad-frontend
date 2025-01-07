import { useState } from 'react'
import { useAccount } from 'wagmi'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import SellComponent from '@/components/Swap/SellComponent'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useSwapProcessManager } from '@/hooks/useSwapProcessManager'
import WalletBalances from '@/components/WalletBalances/WalletBalances'

const SwapView: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const { handleSwap } = useHandleSwap()
  const { quoteLoading } = useSwapProcessManager()
  const { isConnected } = useAccount() // Use RainbowKit's useAccount to check connection

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <div style={{ boxShadow: 'rgba(131, 110, 249, .1) 0px 5px 100px 4px' }} className='rounded-3xl'>
        {isConnected && <WalletBalances />} {/* Only render when wallet is connected */}
        <div className='relative rounded-3xl bg-primary/45'>
          <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-3xl border border-accent'>
            <SellComponent />
            <SwapButton handleSwap={handleSwap} isLoading={quoteLoading} />
            <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapView
