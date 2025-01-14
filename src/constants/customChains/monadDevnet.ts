import { defineChain } from 'viem'

const MONAD_DEVNET_RPC_URL = process.env.NEXT_PUBLIC_MONAD_DEVNET_RPC_URL
const MONAD_DEVNET_EXPLORER_URL = process.env.NEXT_PUBLIC_MONAD_DEVNET_EXPLORER_URL

export const monadDevnet = defineChain({
  id: 20143,
  name: 'Monad Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'DMON',
  },
  rpcUrls: {
    default: {
      http: [MONAD_DEVNET_RPC_URL || ''],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: MONAD_DEVNET_EXPLORER_URL || '' },
  },
  contracts: {},
})
