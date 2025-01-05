import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Connect() {
  return (
    <div className='min-w-max items-center flex'>
      <ConnectButton label='Connect' showBalance={false} accountStatus='full' chainStatus='full' />
    </div>
  )
}
