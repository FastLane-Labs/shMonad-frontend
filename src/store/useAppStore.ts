import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AppRoute } from '@/core/routes'
import type { SwapRoute } from '@/types/swap'
import type { TransactionHistoryStore, TransactionParams } from '@/types'
import { defaultValues } from '@/constants'
import { AppConfig } from '@/types/config'

export interface AppConfigState {
  atlas?: any // Replace with AtlasSdk
  fromPrice?: string
  toPrice?: number
  currentTransaction?: TransactionParams
  currentQuoteId?: string // unique id for the quote
  config: AppConfig
}

export const useAppStore = create<AppConfigState>((_) => ({
  config: defaultValues,
}))

export interface AppRouter {
  history: {
    route: AppRoute
    params?: { [key: string]: any | undefined }
  }[]
}

export const useAppRouterStore = create<AppRouter>((_) => ({
  history: [
    {
      route: {
        id: 'swap',
        path: '/',
        title: 'Swap',
        headerButtons: ['settings', 'history'],
      },
    },
  ],
}))

/**
 * Persist the store in local storage
 * So the user can refresh the page and still see their old transactions
 */
export const usePersistStore = create(
  persist<{
    transactionsHistory?: TransactionHistoryStore[]
  }>(
    (_) => {
      return {
        transactionsHistory: [],
      }
    },
    {
      name: 'atlas.history.store', //TODO update with app name
    }
  )
)

export const useSwapRoutePersistStore = create(
  persist<{
    swapRoute?: SwapRoute
    destinationAddressHasBeenUpdated?: {
      updated: boolean
      filledFromWallet: boolean
    }
  }>(
    (_) => {
      return {
        swapRoute: undefined,
      }
    },
    {
      name: 'atlas.swaproute.store',
    }
  )
)
