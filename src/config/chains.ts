import { ChainConfig } from '@/types/chains'

export const CHAIN_CONFIG: { [chainId: number]: ChainConfig } = {
  137: {
    contracts: {
      atlas: {
        address: '0x912AceADa1b9c9B378894D0610C5684167710FDD',
      },
      atlasVerification: {
        address: '0x2fBF38a38D753E4ce398000CCC552Efa50702e1e',
      },
      dappAddress: {
        address: '0x498aC70345AD6b161eEf4AFBEA8F010401cfa780',
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    eip712Domain: {
      name: 'AtlasVerification',
      version: '1.0',
      chainId: 137,
      verifyingContract: '0x2fBF38a38D753E4ce398000CCC552Efa50702e1e',
    },
    blockExplorerUrl: 'https://polygonscan.com/',
  },
  20143: {
    contracts: {
      atlas: {
        address: '0x912AceADa1b9c9B378894D0610C5684167710FDD',
      },
      atlasVerification: {
        address: '0x2fBF38a38D753E4ce398000CCC552Efa50702e1e',
      },
      dappAddress: {
        address: '0x498aC70345AD6b161eEf4AFBEA8F010401cfa780',
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      },
    },
    eip712Domain: {
      name: 'AtlasVerification',
      version: '1.0',
      chainId: 20143,
      verifyingContract: '0x2fBF38a38D753E4ce398000CCC552Efa50702e1e',
    },
    blockExplorerUrl: 'https://polygonscan.com/',
  },
}
