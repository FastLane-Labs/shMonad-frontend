import React, { PropsWithChildren } from 'react'
import Logo from '@/components/Logo/Logo'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'

export function Layout(props: PropsWithChildren) {
  return (
    <div
      className='flex flex-grow flex-col min-h-screen h-full bg-base-300 bg-[url("https://storage.googleapis.com/brutalist-landing/bg-grain.png")] '
      style={{
        backgroundAttachment: 'fixed',
        backgroundSize: '200px 100px',
        backgroundPosition: 'center',
      }}>
      <Navbar />
      <Logo />
      <main className='flex flex-grow h-full flex-col'>{props.children}</main>
      <section className='md:block hidden'>
        <Footer />
      </section>
    </div>
  )
}
