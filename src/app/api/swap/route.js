import { NextResponse } from 'next/server'
import { ethers } from 'ethers'

const encodeSwapData = (sellToken, buyToken, sellAmount, buyAmount, recipientAddress) => {
  const abiCoder = new ethers.utils.AbiCoder()
  return abiCoder.encode(
    ['address', 'address', 'uint256', 'uint256', 'address'],
    [sellToken, buyToken, sellAmount, buyAmount, recipientAddress]
  )
}

export async function POST(req) {
  // const body = await req.json()
  // const { sellToken, buyToken, sellAmount, buyAmount, slippageTolerance, recipientAddress, chainId } = body

  // const atlasSdk = new AtlasSdk(provider, chainId, operationsRelay)

  try {
    return NextResponse.json({ msg: 'post success' })
    console.log('swap attempted!')

    // const signer = provider.getSigner()

    // const transactionData = encodeSwapData(sellToken, buyToken, sellAmount, buyAmount, recipientAddress)

    // const gasEstimate = await provider.estimateGas({
    //   to: swapContractAddress,
    //   data: transactionData,
    //   value: ethers.utils.parseUnits(sellAmount, 'ether'),
    // })

    // const transaction = {
    //   to: swapContractAddress,
    //   data: transactionData,
    //   value: ethers.utils.parseUnits(sellAmount, 'ether'),
    //   gasLimit: gasEstimate,
    // }

    // const txResponse = await signer.sendTransaction(transaction)
    // await txResponse.wait()

    // return NextResponse.json({ success: true, txHash: txResponse.hash })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(req) {
  return NextResponse.json({ msg: 'Hello from server' })
}
