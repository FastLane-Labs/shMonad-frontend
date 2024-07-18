import { NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { AtlasSdk, FastlaneOperationsRelay } from 'fastlane-atlas-sdk'

// const encodeSwapData = (sellToken, buyToken, sellAmount, buyAmount, recipientAddress) => {
//   const abiCoder = new ethers.utils.AbiCoder()
//   return abiCoder.encode(
//     ['address', 'address', 'uint256', 'uint256', 'address'],
//     [sellToken, buyToken, sellAmount, buyAmount, recipientAddress]
//   )
// }

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json()

    // Extract the parameters from the request body
    const {
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
    } = body

    // init atlas operation relay
    // todo:
    // replace FastlaneOperationsRelay with import {fastlaneBackend} from atlas-sdk
    const operationsRelay = new FastlaneOperationsRelay({
      basePath: 'https://eth-sepolia.atlas-operations-relay.fastlane.xyz',
    })

    // init atlas sdk
    const atlasSdk = new AtlasSdk(provider, chainId, operationsRelay)

    let [userOpHash, solverOperations] = await atlasSdk.submitUserOperation(userOperation, callConfig, hints)

    // Create a response object
    const res = {
      status: 'success',
      message: 'Swap executed successfully',
      data: {
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
      },
    }

    // Return the response
    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message })
  }
}
