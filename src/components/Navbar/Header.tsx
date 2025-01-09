'use client'

import React from 'react'
import Link from 'next/link'
import { Connect } from './Connect'
import { NotificationsDrawer } from '../Notifications/NotificationsDrawer'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { HeartIcon, RocketLaunchIcon, CodeBracketSquareIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className='navbar flex justify-between p-4'>
      <div className=''>
        <Link href='/' className='btn btn-ghost !w-auto group'>
          <RocketLaunchIcon className='h-6 w-6 text-accent transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-[15deg]' />
          <span>Mint</span>
        </Link>
        <Link href='/bond' className='btn btn-ghost !w-auto group'>
          <HeartIcon className='h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-0' />
          <span>Bond</span>
        </Link>
        <Link href='/else' className='btn btn-ghost !w-auto group'>
          <CodeBracketSquareIcon className='h-6 w-6 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-3' />
          <span>Something Else</span>
        </Link>
        {/* Add more links as needed */}
      </div>
      <div className='flex gap-2'>
        <Connect chainStatus='full' />
        <ThemeToggle />
        <NotificationsDrawer />
      </div>
    </header>
  )
}
