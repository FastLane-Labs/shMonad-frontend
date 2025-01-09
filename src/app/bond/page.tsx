'use client'
import { useEffect } from 'react'
import { useAnalytics } from '@/context/AnalyticsContext'
import BondView from '@/views/BondView'

export default function Home() {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView(window.location.pathname)
  }, [trackPageView])

  return (
    <>
      <BondView />
    </>
  )
}
