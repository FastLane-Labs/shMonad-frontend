export const runtime = 'edge'
import { NextResponse } from 'next/server'

import { AtlasSdk, FastlaneOperationsRelay, UserOperation } from 'fastlane-atlas-sdk'
import { ethers } from 'ethers'
// const encodeSwapData = (sellToken, buyToken, sellAmount, buyAmount, recipientAddress) => {
//   const abiCoder = new ethers.utils.AbiCoder()
//   return abiCoder.encode(
//     ['address', 'address', 'uint256', 'uint256', 'address'],
//     [sellToken, buyToken, sellAmount, buyAmount, recipientAddress]
//   )
// }

export async function POST(req: any) {
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
    const operationsRelay = new FastlaneOperationsRelay({
      basePath: 'https://eth-sepolia.atlas-operations-relay.fastlane.xyz',
    })

    // init atlas sdk
    const atlasSdk = new AtlasSdk(provider, chainId, operationsRelay)

    // Define userOperation, callConfig, and hints // Define the user operation
    const userOperation: UserOperation = {
      // add other required properties and methods
    } as UserOperation
    const callConfig = 10

    let [userOpHash, solverOperations] = await atlasSdk.submitUserOperation(userOperation, callConfig)

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
    return NextResponse.json(res)
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message })
  }
}
