import React, { ChangeEvent } from 'react'
import TokenSelectModal from '../Modals/TokenSelectModal'
import { Token } from '@/types'

// Define the types for the props
interface BuyAmountProps {
  buyToken: Token | null
  setBuyToken: (token: Token) => void
  buyAmount: string
  setBuyAmount: (amount: string) => void
  quoteLoading: boolean
}

const BuyAmount: React.FC<BuyAmountProps> = ({ buyToken, setBuyToken, buyAmount, setBuyAmount, quoteLoading }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Ensure the input is valid (numbers and one decimal point)
    if (/^\d*\.?\d*$/.test(value)) {
      setBuyAmount(value)
    }
  }

  return (
    <div className='flex items-center space-x-2'>
      <div className='flex items-center space-x-2 relative'>
        <input
          type='number'
          value={buyAmount}
          onChange={handleChange}
          className='bg-neutral text-white p-2 rounded-xl flex-grow text-4xl w-full focus:outline-none'
          placeholder='0'
        />
        {quoteLoading && <span className='absolute right-4 loading loading-spinner loading-sm'></span>}
      </div>
      <TokenSelectModal selectedToken={buyToken} onSelectToken={setBuyToken} defaultLabel='Select a token' />
    </div>
  )
}

export default BuyAmount
