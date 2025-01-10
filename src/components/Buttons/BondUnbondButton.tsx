import React from 'react'

interface BondUnbondButtonProps {
  isBonding: boolean
  setIsBonding: (isBonding: boolean) => void
}

const BondUnbondButton: React.FC<BondUnbondButtonProps> = ({ isBonding, setIsBonding }) => {
  return (
    <div className='flex w-full justify-center mb-4 -mt-2 z-[1] relative font-medium text-sm'>
      <div className='flex items-center justify-center w-fit px-0.5 bg-neutral/60 rounded-2xl relative overflow-hidden'>
        {/* Sliding Background with Padding */}
        <div
          className='absolute w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-gray-400/10 rounded-xl transition-all duration-300 ease-in-out'
          style={{ transform: `translateX(${isBonding ? '-50%' : '50%'})` }}
        />

        {/* Bond Button */}
        <button
          className={`relative w-20 text-center transition-all duration-300 py-3 ease-in-out
          ${isBonding ? 'text-white' : 'text-gray-400'}`}
          onClick={() => setIsBonding(true)}>
          Bond
        </button>

        {/* Unbond Button */}
        <button
          className={`relative w-20 text-center transition-all duration-300 py-3 ease-in-out
          ${!isBonding ? 'text-white' : 'text-gray-400'}`}
          onClick={() => setIsBonding(false)}>
          Unbond
        </button>
      </div>
    </div>
  )
}

export default BondUnbondButton
