import React from 'react'
import TokenSelect from './TokenSelect'

const SellAmount = ({ sellToken, setSellToken, sellAmount, setSellAmount, address, balance }) => {
  const handleChange = (e) => {
    const value = e.target.value
    // Ensure the input is valid (numbers and one decimal point)
    if (/^\d*\.?\d*$/.test(value)) {
      setSellAmount(value)
    }
  }

  const handleSetMax = () => {
    setSellAmount(balance)
  }
  return (
    <div className='flex items-center space-x-2'>
      <input
        type='text'
        value={sellAmount}
        onChange={handleChange}
        className='bg-neutral text-white p-2 rounded-2xl flex-grow text-4xl w-full focus:outline-none'
        placeholder='0'
      />
      <button className='btn bg-secondary text-primary' onClick={handleSetMax}>
        MAX
      </button>
      <TokenSelect value={sellToken} onChange={setSellToken} address={address} defaultLabel={'Select a token'} />
    </div>
  )
}

export default SellAmount
