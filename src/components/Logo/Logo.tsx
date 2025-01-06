import React from 'react'
import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <div className='flex justify-center logo-margins'>
      <Image src='/shmonad.png' alt='RocketBoost Logo' width={220} height={220} />
    </div>
  )
}

export default Logo
