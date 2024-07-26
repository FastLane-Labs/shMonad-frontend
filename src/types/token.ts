export type Token = {
  chainId: number
  address: string
  decimals: number
  name: string
  symbol: string
  logoURI: string
}

export interface ITokenProvider {
  getTokensByChainId(chainId: number): Promise<Token[]>
}
