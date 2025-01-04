import React from 'react'
import { useSwapStateContext } from '@/context/SwapStateContext'

const FlipButton: React.FC = () => {
  const {
    fromToken: sellToken,
    setFromToken: setSellToken,
    setFromAmount: setSellAmount,
    toToken: buyToken,
    setToToken: setBuyToken,
    toAmount: buyAmount,
    setToAmount: setBuyAmount,
    isQuoteing,
    setDiscardNextQuoteUpdate,
    resetSwapData,
    setAllowQuoteUpdate, // Add this
  } = useSwapStateContext()

  const handleSwapArrow = async () => {
    setAllowQuoteUpdate(false) // Prevent quoting
    if (buyToken) {
      // If there's a buy token, perform a full swap
      setSellToken(buyToken)
      setSellAmount(buyAmount)
      setBuyToken(sellToken)
      setBuyAmount('')
    } else {
      // If there's no buytoken, just swap the tokens and clear sellToken
      setBuyToken(sellToken)
      setSellToken(null)
      setSellAmount('')
    }
    resetSwapData()
    setDiscardNextQuoteUpdate(true)
    // Re-enable quoting after a short delay
    setTimeout(() => setAllowQuoteUpdate(true), 100)
  }

  return (
    <div className='relative flex justify-center mb-1'>
      <button
        onClick={handleSwapArrow}
        className='absolute bg-gradient-to-br from-primary to-[#9333ea] from-35% text-white border-none p-[0.3rem] rounded-lg -top-3
          bg-[length:150%_150%] bg-[position:0_100%] hover:bg-[position:15%_15%] transition-all duration-500 ease-in-out'
        disabled={(!sellToken && !buyToken) || isQuoteing}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='.2 0 24 24'
          stroke='currentColor'
          strokeWidth='2'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </button>
    </div>
  )
}

export default FlipButton
