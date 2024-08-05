import React, { useState, useEffect } from 'react'
import FlipButton from '@/components/Buttons/FlipButton'
import SettingsButton from '@/components/Buttons/SettingsButton'
import SwapButton from '@/components/Buttons/SwapButton'
import SettingsModal from '@/components/Modals/SettingsModal'
import BuyComponent from '@/components/Swap/BuyComponent'
import SellComponent from '@/components/Swap/SellComponent'
import BackgroundGradient from '@/components/Theme/BackgroundGradient'
import { useHandleSwap } from '@/hooks/useHandleSwap'
import { useBaselineQuote } from '@/hooks/useBaselineQuote'
import IUXModal from '@/components/iUX/IUX'

const SwapView: React.FC = () => {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false)
  const [isIUXModalVisible, setIsIUXModalVisible] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const isModalClosed = localStorage.getItem('isIUXModalClosed')
    if (!isModalClosed) {
      setIsIUXModalVisible(true)
    }
    setIsLoaded(true) // Indicate that the loading is complete
  }, [])

  const handleIUXModalClose = () => {
    localStorage.setItem('isIUXModalClosed', 'true')
    setIsIUXModalVisible(false)
  }

  const handleIUXModalOpen = () => {
    localStorage.removeItem('isIUXModalClosed')
    setIsIUXModalVisible(true)
  }

  const { handleSwap, isSwapping } = useHandleSwap()
  const isQuoteLoading = useBaselineQuote()

  if (!isLoaded) {
    // Render nothing or a loading indicator while loading
    return null
  }

  return (
    <div className='relative max-w-md mx-auto'>
      <IUXModal isVisible={isIUXModalVisible} onClose={handleIUXModalClose} />
      <BackgroundGradient />
      <div
        className='relative rounded-3xl bg-base-200/30'
        style={{ boxShadow: 'rgba(241, 32, 116, .2) 0px 5px 90px 4px' }}>
        <div className='gradient-bg relative max-w-md mx-auto p-4 rounded-3xl border border-accent'>
          <div className='flex justify-end items-center mb-2'>
            <SettingsButton setIsSettingsModalVisible={setIsSettingsModalVisible} />
          </div>
          <SellComponent />
          <FlipButton />
          <BuyComponent />
          <SwapButton handleSwap={handleSwap} isLoading={isSwapping || isQuoteLoading} />
          <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
        </div>
      </div>
      {/* <button className='fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded' onClick={handleIUXModalOpen}>
        Open Modal
      </button> */}
    </div>
  )
}

export default SwapView
