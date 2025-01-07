import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

type ChainStatusType = 'full' | 'none' | 'icon'

interface ConnectProps {
  chainStatus?: ChainStatusType
}

export function Connect({ chainStatus = 'full' }: ConnectProps) {
  return (
    <div className='min-w-max items-center flex'>
      <ConnectButton label='Connect' showBalance={false} accountStatus='full' chainStatus={chainStatus} />
    </div>
  )
}
