declare module '@/constants/tokenList.json' {
  interface Token {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
  }

  interface Version {
    major: number
    minor: number
    patch: number
  }

  interface TokenList {
    name: string
    timestamp: string
    version: Version
    tags: Record<string, any>
    logoURI: string
    keywords: string[]
    tokens: Token[]
  }

  const tokenList: TokenList
  export default tokenList
}
