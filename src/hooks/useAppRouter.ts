import { useMemo } from 'react'
import type { Routes, AppRoute } from '../core/routes'
import { useAppRouterStore, useAppStore } from '@/store/useAppStore'

export const useAppRouter = () => {
  const { config } = useAppStore()
  const { history } = useAppRouterStore()

  const switchRoute = (
    route: AppRoute,
    params?: { [key: string]: any | undefined } | undefined,
    addRouteToHistory = true
  ) => {
    const currentHistory = useAppRouterStore.getState().history
    if (addRouteToHistory) {
      useAppRouterStore.setState({
        history: [...currentHistory, { route, params }],
      })
    } else {
      useAppRouterStore.setState({
        history: [...currentHistory.slice(0, -1), { route, params }],
      })
    }
  }

  const previousRoute = () => {
    const currentHistory = useAppRouterStore.getState().history
    if (currentHistory.length > 1) {
      currentHistory.pop()
      useAppRouterStore.setState({
        history: currentHistory,
      })
    }
  }

  const currentRoute = history[history.length - 1].route
  const currentRouteParams = history[history.length - 1].params

  const configRouteTitleSet = useMemo(() => {
    if (config.titles !== undefined) {
      return config.titles?.[currentRoute.id as Routes] ?? undefined
    }
    return undefined
  }, [config.titles, currentRoute])

  const currentRouteTitle = useMemo(
    () => configRouteTitleSet ?? currentRoute?.title ?? 'Atlas',
    [currentRoute?.title, configRouteTitleSet]
  )

  return {
    currentRoute,
    currentRouteTitle,
    switchRoute,
    previousRoute,
    currentRouteParams,
  }
}
