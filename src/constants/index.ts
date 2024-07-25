export enum ChainId {
  POLYGON = 137,
}

export enum Exchange {
  UNISWAPV3 = 'UNISWAPV3',
}

export enum SwapType {
  EXACT_IN = 'EXACT_IN',
  EXACT_OUT = 'EXACT_OUT',
}

interface ExchangeAddresses {
  quoter: string
  factory: string
  router: string
}

export const CONTRACT_ADDRRESSES: { [chainId in ChainId]: { [exchange in Exchange]: ExchangeAddresses } } = {
  [ChainId.POLYGON]: {
    [Exchange.UNISWAPV3]: {
      quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      router: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
  },
}
