import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Connect() {
  return (
    <div>
      <ConnectButton label='Connect' showBalance={false} />
    </div>
  )
}
