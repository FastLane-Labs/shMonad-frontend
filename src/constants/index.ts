import { AppConfigState } from '@/store/useAppStore'
import { Address } from 'viem'

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
  quoter: Address
  factory: Address
  router: Address
}

export const CONTRACT_ADDRRESSES: { [chainId in ChainId]: { [exchange in Exchange]: ExchangeAddresses } } = {
  [ChainId.POLYGON]: {
    [Exchange.UNISWAPV3]: {
      quoter: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e', // QuoterV2
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984', // UniswapV3Factory
      router: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // SwapRouter02
    },
  },
}

export const defaultValues: AppConfigState = {
  config: {
    slippage: 0.5,
    titles: {
      swap: 'Swap',
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
  },
}
