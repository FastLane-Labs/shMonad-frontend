import { Exchange as ExchangeName } from '@/constants'
import { Exchange } from './base'
import { UniswapV3 } from './uniswapV3'

export function getExchange(exchange: ExchangeName): typeof Exchange {
  switch (exchange) {
    case ExchangeName.UNISWAPV3:
      return UniswapV3
    default:
      throw new Error('Exchange not supported')
  }
}
