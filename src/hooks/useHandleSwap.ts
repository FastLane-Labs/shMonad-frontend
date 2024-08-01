import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useEthersProviderContext } from '@/context/EthersProviderContext'
import { useSwapContext } from '@/context/SwapContext'
import {
  buildSwapIntent,
  buildBaselineCallData,
  buildUserOperation,
  getUserOperationHash,
  getExecutionEnvironment,
} from '@/utils/atlas'
import { useFastLaneOnline } from './useFastLaneOnline'
import { ethers } from 'ethers'
import { FastlaneOnlineAbi } from '@/abis'
import { Address } from 'viem'

export const useHandleSwap = () => {
  const { signer, provider } = useEthersProviderContext()
  const { address } = useAccount()
  const { quote, quoteLoading } = useSwapContext()
  const [isSwapping, setIsSwapping] = useState(false)
  const { dappAddress, verificationAddress } = useFastLaneOnline()

  const handleSwap = useCallback(async () => {
    if (!address || !provider || !quote || quoteLoading || !dappAddress || !verificationAddress) {
      console.error('Missing required data for swap')
      return false
    }

    setIsSwapping(true)
    try {
      // Build swap intent
      const swapIntent = buildSwapIntent(quote)

      // Hardcoded - no good
      const executionEnvironment = await getExecutionEnvironment(
        '0x892F8f6779ca6927c1A6Cc74319e03d2abEf18D5',
        dappAddress as Address,
        dappAddress as Address,
        provider
      )

      // Build baseline call data
      const baselineCall = await buildBaselineCallData(quote, executionEnvironment)

      // Prepare other parameters for user operation
      const block = await provider.getBlock('latest')
      const maxFeePerGas = block?.baseFeePerGas! * 2n * BigInt(1e9) // Example: set max fee to 2x current base fee
      const deadline = block?.number! + 200 // Example: set deadline 200 blocks away
      const gas = 2000000n // Example gas limit, adjust as needed

      console.log('maxFeePerGas', maxFeePerGas)

      // Build user operation
      const userOperation = await buildUserOperation(
        address,
        swapIntent,
        baselineCall,
        deadline,
        gas,
        maxFeePerGas,
        dappAddress,
        provider
      )
      //Get user operation hash
      const userOpHash = await getUserOperationHash(userOperation, verificationAddress, provider)

      const contract = new ethers.Contract(dappAddress, FastlaneOnlineAbi, signer)
      const tx = await contract.fastOnlineSwap(swapIntent, baselineCall, deadline, gas, maxFeePerGas, userOpHash, {
        gasLimit: gas,
      })

      console.log('Swap transaction submitted:', tx.hash)
      await tx.wait()
      console.log('Swap transaction confirmed')

      return true
    } catch (error) {
      console.error('Swap failed', error)
      return false
    } finally {
      setIsSwapping(false)
    }
  }, [address, provider, quote, quoteLoading, dappAddress, verificationAddress])

  return {
    handleSwap,
    isSwapping,
  }
}
