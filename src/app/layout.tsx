'use client'

import '@rainbow-me/rainbowkit/styles.css'
import type { Viewport } from 'next'
import { Fragment, PropsWithChildren, useEffect } from 'react'
import { Layout } from '@/components/UILayout'
import ClientWeb3Provider from '../context/ClientWeb3Provider'
import { NotificationProvider } from '@/context/Notifications'
import '../assets/globals.css'
import React from 'react'
import { AppStateProvider } from '@/context/AppStateContext'
import { TokenPriceProvider } from '@/context/TokenPriceProvider'
import dynamic from 'next/dynamic'
import { useAnalytics } from '@/context/AnalyticsContext'
import { SwapStateProvider } from '@/context/SwapStateContext'

const AnalyticsProvider = dynamic(() => import('@/context/AnalyticsContext').then((mod) => mod.AnalyticsProvider), {
  ssr: false,
})

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1.0,
  viewportFit: 'cover',
  themeColor: '#F12379',
}

function AnalyticsWrapper({ children }: PropsWithChildren) {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    const referrer = document.referrer
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('utm_source')
    const utmMedium = urlParams.get('utm_medium')
    const utmCampaign = urlParams.get('utm_campaign')

    trackEvent(
      {
        type: 'FUNNEL',
        step: 'page_view',
        details: window.location.pathname,
      },
      {
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
      }
    )
  }, [trackEvent])

  return <>{children}</>
}

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang='en' className='bg-[#0f0f0f]'>
      <head>
        <title>shMonad</title>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='shMONAD.xyz is a decentralized application enabling users to mint, bond, unbond, and manage shMONAD tokens by interacting with smart contracts directly on the blockchain. Atlas is a generalized execution abstraction protocol for the EVM used for building intent and MEV auctions.'
        />
        <meta name='keywords' content='SHMONAD, Atlas, Monad, MEV, FastLane Labs' />
        <meta name='author' content='FastLane Labs' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@0xFastLane' />
        <meta name='twitter:title' content='shMonad' />
        <meta
          name='twitter:description'
          content='shMONAD.xyz is a decentralized application enabling users to mint, bond, unbond, and manage shMONAD tokens by interacting with smart contracts directly on the blockchain.'
        />
        <meta property='og:image' content='https://blocked-custom-page.vercel.app/rocketboost-beta-og.png' />
        <meta property='og:title' content='Rocketboost' />
        <meta
          property='og:description'
          content='Rocketboost Swaps are powered by the DRFQ Atlas module built by FastLane Labs.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://rocketboost.me' />
        <meta property='og:image' content='https://blocked-custom-page.vercel.app/rocketboost-beta-og.png' />
        <meta property='og:image:alt' content='Rocketboost beta' />
        <meta property='og:site_name' content='Rocketboost' />
        <meta property='og:locale' content='en_US' />
        <link rel='apple-touch-icon' sizes='180x180' href='favicons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='favicons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='favicons/favicon-16x16.png' />
        <link rel='manifest' href='favicons/site.webmanifest' />
        <link rel='mask-icon' href='favicons/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#F12379' />
      </head>
      <body>
        <AnalyticsProvider>
          <AnalyticsWrapper>
            <ClientWeb3Provider>
              <TokenPriceProvider>
                <NotificationProvider>
                  <AppStateProvider>
                    <SwapStateProvider>
                      <Layout>{props.children}</Layout>
                    </SwapStateProvider>
                  </AppStateProvider>
                </NotificationProvider>
              </TokenPriceProvider>
            </ClientWeb3Provider>
          </AnalyticsWrapper>
        </AnalyticsProvider>
      </body>
    </html>
  )
}

export const AppRouter: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const Router = Fragment
  return <Router>{children}</Router>
}
