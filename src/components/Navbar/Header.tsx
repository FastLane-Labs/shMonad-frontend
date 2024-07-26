import React from 'react'
import { LinkComponent } from '../LinkComponent'
import { SITE_EMOJI } from '@/utils/siteInfo'
import { Connect } from './Connect'
import { NotificationsDrawer } from '../Notifications/NotificationsDrawer'
import ThemeToggle from '@/components/ThemeToggle'

export function Header() {
  return (
    <header className='navbar flex justify-end p-4 pt-0'>
      <div className='flex gap-2'>
        <Connect />
        <NotificationsDrawer />
        <ThemeToggle />
      </div>
    </header>
  )
}
