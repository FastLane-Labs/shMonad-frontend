import { polygon, mainnet } from 'viem/chains'
import { monadDevnet } from '../config/monadDevnet'
import { Chain } from 'viem/chains'

export const SUPPORTED_CHAINS = [polygon, mainnet, monadDevnet] as [Chain, ...Chain[]]

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)
