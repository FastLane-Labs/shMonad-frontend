import { AbstractSigner, ethers } from 'ethers'
import { Address } from 'viem'

// Placeholder ABI for now, will replace when we receive the actual SC ABI
const placeholderAbi = [
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'policyID', type: 'uint64' },
    ],
    name: 'bond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'policyID', type: 'uint64' },
    ],
    name: 'unbond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

/**
 * Initialize the contract instance
 * @param contractAddress The contract address
 * @param provider The ethers provider
 */
function getContractInstance(contractAddress: string, provider: ethers.Provider) {
  return new ethers.Contract(contractAddress, placeholderAbi, provider)
}

/**
 * Mint ShMONAD tokens by depositing MON
 * @param contractAddress The contract address
 * @param signer The signer for the transaction
 * @param amount The amount of MON to deposit
 */
export async function mintShMONAD(
  contractAddress: Address,
  signer: AbstractSigner,
  amount: bigint
): Promise<ethers.ContractTransaction> {
  try {
    const contract = new ethers.Contract(contractAddress, placeholderAbi, signer)
    const tx = await contract.deposit({ value: amount })
    await tx.wait()
    console.log('ShMONAD successfully minted!')
    return tx
  } catch (error) {
    console.error('Error minting ShMONAD:', error)
    throw error
  }
}

/**
 * Bond ShMONAD tokens
 * @param contractAddress The contract address
 * @param signer The signer for the transaction
 * @param amount The amount to bond
 * @param policyID The policy ID for bonding
 */
export async function bondShMONAD(
  contractAddress: Address,
  signer: AbstractSigner,
  amount: bigint,
  policyID: bigint
): Promise<ethers.ContractTransaction> {
  try {
    const contract = new ethers.Contract(contractAddress, placeholderAbi, signer)
    const tx = await contract.bond(amount, policyID)
    await tx.wait()
    console.log('ShMONAD successfully bonded!')
    return tx
  } catch (error) {
    console.error('Error bonding ShMONAD:', error)
    throw error
  }
}

/**
 * Unbond ShMONAD tokens
 * @param contractAddress The contract address
 * @param signer The signer for the transaction
 * @param amount The amount to unbond
 * @param policyID The policy ID for unbonding
 */
export async function unbondShMONAD(
  contractAddress: Address,
  signer: AbstractSigner,
  amount: bigint,
  policyID: bigint
): Promise<ethers.ContractTransaction> {
  try {
    const contract = new ethers.Contract(contractAddress, placeholderAbi, signer)
    const tx = await contract.unbond(amount, policyID)
    await tx.wait()
    console.log('ShMONAD successfully unbonded!')
    return tx
  } catch (error) {
    console.error('Error unbonding ShMONAD:', error)
    throw error
  }
}

/**
 * Get the balance of ShMONAD tokens for a user
 * @param contractAddress The contract address
 * @param userAddress The user address
 * @param provider The provider
 */
export async function getShMONADBalance(
  contractAddress: Address,
  userAddress: Address,
  provider: ethers.Provider
): Promise<bigint> {
  try {
    const contract = getContractInstance(contractAddress, provider)
    const balance = await contract.balanceOf(userAddress)
    return balance
  } catch (error) {
    console.error('Error getting balance:', error)
    throw error
  }
}
