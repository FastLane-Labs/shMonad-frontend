'use client'
// This component is the same as HandleAtlas.js,
// except it submits a POST req to '/api/swap' instead of
// using a custom hook

import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import axios from 'axios'
import { ethers } from 'ethers'
import { getDappAddress, getControlAddress } from '@/utils/getContractAddress'
import SwapButton from './SwapButton'

const HandleSwap = ({ sellToken, buyToken, sellAmount, slippageTolerance, transactionDeadline, address }) => {
  const { data: walletClient, isError, isLoading } = useWalletClient()
  const { address: account, chain: chainInfo } = useAccount()
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState(null)

  const handleSwap = async () => {
    if (!chainInfo) {
      setError('Chain information is not available')
      console.error('Swap failed', error)
      return
    }

    setIsSwapping(true)
    setError(null)

    try {
      /////////////////////////////////////////////////
      // Atlas Parameters:
      const chain = chainInfo.id
      const provider = walletClient
      const operationsRelayUrl = 'https://eth-sepolia.atlas-operations-relay.fastlane.xyz'
      const dapp = getDappAddress(chain)
      const control = getControlAddress(chain)
      let value, gasEstimate, deadline, data
      /////////////////////////////////////////////////

      // Make the API request
      const response = await axios.post('/api/swap', {
        sellToken,
        buyToken,
        sellAmount,
        slippageTolerance,
        transactionDeadline,
        address: account,
        chainId: chain,
        provider,
        operationsRelayUrl,
        dapp,
        control,
      })

      // Assuming the response contains transaction details
      console.log('Swap successful', response.data)
    } catch (error) {
      console.error('Swap failed', error)
      setError(error.message)
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <SwapButton
      isConnected={!!account}
      sellAmount={sellAmount}
      buyToken={buyToken}
      handleSwap={handleSwap}
      isLoading={isSwapping || isLoading || !walletClient}
    />
  )
}

export default HandleSwap
