import { useState } from 'react'
import { ethers } from 'ethers'
import { AtlasSdk, BaseOperationRelay } from 'fastlane-atlas-sdk'

const useAtlas = () => {
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState(null)

  const handleSwap = async ({
    sellToken,
    buyToken,
    sellAmount,
    slippageTolerance,
    transactionDeadline,
    address,
    chainId,
    provider,
    operationsRelayUrl,
    dapp,
    control,
  }) => {
    setIsSwapping(true)
    setError(null)

    try {
      // Init atlas operation relay
      // todo:
      // replace FastlaneOperationsRelay with import {fastlaneBackend} from atlas-sdk
      // const operationsRelay = new FastlaneOperationsRelay({
      //   basePath: operationsRelayUrl,
      // })

      // Init atlas sdk
      // const atlasSdk = new AtlasSdk(provider, chainId, BaseOperationRelay)

      const userOperation = {}
      const callConfig = {}
      const hints = {}

      // let [userOpHash, solverOperations] = await atlasSdk.submitUserOperation(userOperation, callConfig, hints)

      console.log('Swap executed successfully', {
        sellToken,
        buyToken,
        sellAmount,
        slippageTolerance,
        transactionDeadline,
        address,
        chainId,
        provider,
        operationsRelayUrl,
        dapp,
        control,
      })

      return {
        status: 'success',
        message: 'Swap executed successfully',
      }
    } catch (error) {
      setError(error.message)
      return {
        status: 'error',
        message: error.message,
      }
    } finally {
      setIsSwapping(false)
    }
  }

  return { handleSwap, isSwapping, error }
}

export default useAtlas
