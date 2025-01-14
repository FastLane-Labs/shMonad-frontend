import React from 'react'
import { useSwapStateContext } from '@/context/SwapStateContext'

const BondUnbondButton: React.FC = () => {
  const { appState, setAppState } = useSwapStateContext()

  return (
    <div className='flex w-full justify-center mb-4 -mt-2 z-[1] relative font-medium text-sm'>
      <div className='flex items-center justify-center w-fit px-0.5 bg-neutral/60 rounded-2xl relative overflow-hidden'>
        {/* Sliding Background with Padding */}
        <div
          className='absolute w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-gray-400/10 rounded-xl transition-all duration-300 ease-in-out'
          style={{ transform: `translateX(${appState === 'Bond' ? '-50%' : '50%'})` }}
        />

        {/* Bond Button */}
        <button
          className={`relative w-20 text-center transition-all duration-300 py-3 ease-in-out
          ${appState === 'Bond' ? 'text-white' : 'text-gray-400'}`} // Update here
          onClick={() => setAppState('Bond')}>
          Bond
        </button>

        {/* Unbond Button */}
        <button
          className={`relative w-20 text-center transition-all duration-300 py-3 ease-in-out
          ${appState === 'Bond' ? 'text-white' : 'text-gray-400'}`} // Update here
          onClick={() => setAppState('Unbond')}>
          Unbond
        </button>
      </div>
    </div>
  )
}

export default BondUnbondButton
