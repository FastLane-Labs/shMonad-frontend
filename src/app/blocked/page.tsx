import React from 'react'
import Logo from '@/components/Logo/Logo'

const GeoBlock: React.FC = () => {
  return (
    <div className='relative overflow-hidden w-full'>
      <div
        className='bg-base-300 bg-[url("https://storage.googleapis.com/brutalist-landing/bg-grain.png")]'
        style={{
          backgroundAttachment: 'fixed',
          backgroundSize: '235px 235px',
        }}>
        <div className='items-center flex-col justify-center relative flex w-screen h-screen overflow-hidden p-3'>
          <div className='gradient-1-geoblock' />
          <div className='gradient-2-geoblock' />
          <Logo />
          <div className='text-center mb-4'>
            <h1 className='text-neutral-content text-5xl font-bold'>Access Restricted</h1>
            <p className='text-white/[0.6] max-[30rem] mt-7'>
              Unfortunately, RocketBoost is unavailable in your country
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeoBlock
