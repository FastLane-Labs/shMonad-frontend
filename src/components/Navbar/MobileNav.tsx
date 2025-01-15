'use client'

import React from 'react'
import Link from 'next/link'
import { RocketLaunchIcon, HeartIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { useSwapStateContext } from '@/context/SwapStateContext'

export function MobileNav() {
  const { appState, setAppState } = useSwapStateContext()

  // Helper function to determine active icon color based on appState
  const getIconStyle = (state: string, activeColor: string) => (appState === state ? activeColor : 'text-gray-400')

  // Helper function for active text color
  const getTextStyle = (state: string) => (appState === state ? 'text-gray-100' : 'text-gray-400')

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-base-300/80 p-0 flex border-t border-neutral-700 z-50'>
      {/* Mint Link */}
      <Link
        href='/'
        className='flex flex-col items-center justify-center w-1/3 py-4 gap-0.5'
        onClick={() => setAppState('Mint')}>
        <RocketLaunchIcon className={`h-6 w-6 ${getIconStyle('Mint', 'text-accent')}`} />
        <span className={`text-xs ${getTextStyle('Mint')}`}>Mint</span>
      </Link>

      {/* Bond Link */}
      <Link
        href='/bond'
        className='flex flex-col items-center justify-center w-1/3 py-4 gap-0.5'
        onClick={() => setAppState('Bond')}>
        <HeartIcon className={`h-6 w-6 ${getIconStyle('Bond', 'text-red-500')}`} />
        <span className={`text-xs ${getTextStyle('Bond')}`}>Bond</span>
      </Link>

      {/* Unbond Link (navigates to bond but sets state to Unbond) */}
      <Link
        href='/bond'
        className='flex flex-col items-center justify-center w-1/3 py-4 gap-0.5'
        onClick={() => setAppState('Unbond')}>
        <ArrowRightStartOnRectangleIcon className={`h-6 w-6 ${getIconStyle('Unbond', 'text-blue-500')}`} />
        <span className={`text-xs ${getTextStyle('Unbond')}`}>Unbond</span>
      </Link>
    </nav>
  )
}

export default MobileNav
