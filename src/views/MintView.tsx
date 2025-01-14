import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import SwapButton from '@/components/Buttons/SwapButton'
import SellComponent from '@/components/Swap/SellComponent'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useSwapProcessManager } from '@/hooks/useSwapProcessManager'
import MonadBalances from '@/components/WalletBalances/MonadBalances'
import { useSwapStateContext } from '@/context/SwapStateContext'

const MintView: React.FC = () => {
  const { appState, setAppState } = useSwapStateContext()
  const { handleSwap } = useHandleSwap()
  const { quoteLoading } = useSwapProcessManager()
  const { isConnected } = useAccount() // Use RainbowKit's useAccount to check connection

  useEffect(() => {
    setAppState('Mint')
    console.log('appState:', appState)
  }, [])

  return (
    <div className='relative max-w-md mx-auto'>
      <BackgroundGradient />
      <div style={{ boxShadow: 'rgba(131, 110, 249, .1) 0px 5px 100px 4px' }} className='rounded-3xl'>
        {isConnected && <MonadBalances />} {/* Only render when wallet is connected */}
        <div className='relative rounded-3xl bg-primary/45'>
          <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-3xl border border-accent'>
            <SellComponent />
            <SwapButton handleSwap={handleSwap} isLoading={quoteLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintView
