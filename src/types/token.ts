import { ChainId } from '@/constants'
import { Address } from 'viem'

export type Token = {
  chainId: ChainId
  address: Address
  decimals: number
  name: string
  symbol: string
  logoURI: string
}

export interface ITokenProvider {
  getTokensByChainId(chainId: number): Promise<Token[]>
}
