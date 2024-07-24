import React, { useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'

const SwapButton = ({ isConnected, sellAmount, buyToken, handleSwap, isLoading }) => {
  const { open } = useWeb3Modal()
  const [localLoading, setLocalLoading] = useState(false)

  const handleClick = async () => {
    setLocalLoading(true)
    await handleSwap()
    setLocalLoading(false)
  }

  if (!isConnected) {
    return (
      <button className='btn bg-secondary rounded-2xl w-full text-white' onClick={() => open()}>
        Connect wallet
      </button>
    )
  } else if (!sellAmount) {
    return (
      <button className='btn bg-secondary rounded-2xl w-full text-white' disabled>
        Enter an amount
      </button>
    )
  } else if (!buyToken) {
    return (
      <button className='btn bg-secondary rounded-2xl w-full text-white' disabled>
        Select a token
      </button>
    )
  } else {
    return (
      <button
        className='btn bg-secondary rounded-2xl w-full text-white'
        onClick={handleClick}
        disabled={isLoading || localLoading}>
        {localLoading ? (
          <>
            <span className='loading loading-spinner'></span>Initiating swap
          </>
        ) : (
          'Swap'
        )}
      </button>
    )
  }
}

export default SwapButton
