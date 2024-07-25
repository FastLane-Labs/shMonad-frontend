import { Routes } from '@/core/routes'
import { Token } from './token'

export type SlippageOption = 0.1 | 0.5 | 1
export interface AppConfig {
  slippage?: SlippageOption
  deadline?: number
  hideAnimations?: boolean
  priceImpactWarnings?: {
    warning: number
    critical: number
  }
  titles?: Record<Routes, string> // Header titles
  favTokens?: Token[]
  defaultTokens?: Token[]
}
