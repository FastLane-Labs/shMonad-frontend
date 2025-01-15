'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Connect } from './Connect'
import { NotificationsDrawer } from '../Notifications/NotificationsDrawer'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { HeartIcon, RocketLaunchIcon, CodeBracketSquareIcon } from '@heroicons/react/24/outline'

export function Navbar() {
  const pathname = usePathname() // Get the current route

  // Helper function to determine active icon color
  const getIconStyle = (route: string, activeColor: string) => (pathname === route ? activeColor : 'text-gray-400')

  // Helper function for active text color
  const getTextStyle = (route: string) => (pathname === route ? 'text-gray-100' : 'text-gray-400')

  return (
    <header className='navbar flex justify-between p-4'>
      <div>
        {/* Mint Link */}
        <Link href='/' className='btn btn-ghost !w-auto group flex items-center gap-2'>
          <RocketLaunchIcon
            className={`h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-[15deg] ${getIconStyle('/', 'text-accent')}`}
          />
          <span className={`${getTextStyle('/')}`}>Mint</span>
        </Link>

        {/* Bond Link */}
        <Link href='/bond' className='btn btn-ghost !w-auto group flex items-center gap-2'>
          <HeartIcon
            className={`h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-0 ${getIconStyle('/bond', 'text-red-500')}`}
          />
          <span className={`${getTextStyle('/bond')}`}>Bond</span>
        </Link>

        {/* Something Else Link */}
        <Link href='/else' className='btn btn-ghost !w-auto group flex items-center gap-2'>
          <CodeBracketSquareIcon
            className={`h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-3 ${getIconStyle('/else', 'text-blue-500')}`}
          />
          <span className={`${getTextStyle('/else')}`}>Something Else</span>
        </Link>
      </div>

      <div className='flex gap-2'>
        <Connect chainStatus='full' />
        <ThemeToggle />
        <NotificationsDrawer />
      </div>
    </header>
  )
}
