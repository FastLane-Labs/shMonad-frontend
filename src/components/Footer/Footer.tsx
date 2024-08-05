import React from 'react'
import { NetworkStatus } from './NetworkStatus'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export function Footer() {
  return (
    <>
      <div className='place-self-end'>
        <div className='flex items-center gap-1 p-4'>
          <NetworkStatus />
          {/* <button className=''>
            <QuestionMarkCircleIcon className='h-5 w-5 mb-px text-gray-400' />
          </button> */}
        </div>
      </div>
    </>
  )
}
