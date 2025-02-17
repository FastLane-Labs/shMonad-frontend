'use client'
import { useEffect } from 'react'
import { useAnalytics } from '@/context/AnalyticsContext'
import MintView from '@/views/MintView'

export default function Home() {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(window.location.pathname)
  }, [trackPageView])

  return (
    <>
      <MintView />
    </>
  )
}
