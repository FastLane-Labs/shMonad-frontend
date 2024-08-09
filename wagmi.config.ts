import { http, createConfig } from 'wagmi'
import { createPublicClient } from 'viem'
import { polygon } from 'wagmi/chains'

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
})

export const publicClient = createPublicClient({
  chain: polygon,
  transport: http(),
})
