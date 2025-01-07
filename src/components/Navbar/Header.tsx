import React from 'react'
import { Connect } from './Connect'
import { NotificationsDrawer } from '../Notifications/NotificationsDrawer'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { HeartIcon, RocketLaunchIcon, FaceSmileIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className='navbar flex justify-between p-4'>
      <div className='text-red-300'>
        <button className='btn btn-ghost !w-auto'>
          <RocketLaunchIcon className={'h-6 w-6 text-accent'} />
          <span>Mint</span>
        </button>
        <button className='btn btn-ghost !w-auto'>
          <HeartIcon className={'h-6 w-6'} />
          <span>Bond</span>
        </button>
        <button className='btn btn-ghost !w-auto'>
          <FaceSmileIcon className={'h-6 w-6'} />
          <span>Something Else</span>
        </button>
      </div>
      <div className='flex gap-2'>
        <Connect />
        <ThemeToggle />
        <NotificationsDrawer />
      </div>
    </header>
  )
}
