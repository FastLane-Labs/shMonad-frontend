'use client'
import Logo from '@/components/Logo/Logo'
import FastlaneApp from '@/core/routes'
import { Header } from '@/components/Navbar/Header'
import { Footer } from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <Logo />
      <FastlaneApp />
      <Footer />
    </>
  )
}
