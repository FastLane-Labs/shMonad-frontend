import React from 'react'
import TokenSelect from './TokenSelect'

const BuyAmount = ({ buyToken, setBuyToken, buyAmount, setBuyAmount, address, quoteLoading }) => {
  const handleChange = (e) => {
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
      <TokenSelect value={buyToken} onChange={setBuyToken} address={address} defaultLabel='Select a token' />
    </div>
  )
}

export default BuyAmount
