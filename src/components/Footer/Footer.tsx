import React from 'react'
import { NetworkStatus } from './NetworkStatus'

export function Footer() {
  return (
    <>
      <div className='place-self-end'>
        <NetworkStatus />
      </div>
    </>
  )
}
