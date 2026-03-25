import React from 'react'
import Hero from '@/components/home/hero/Hero'
import About from '@/components/home/journey/about'
import JourneyCards from '@/components/home/journey/cards'
import SafetyHeader from '@/components/home/safety/header'
import SafetyCards from '@/components/home/safety/cards'
import GenuineSection from '@/components/home/genuine/genie'

function page() {
  return (
    <main>
      <Hero />
      <About />
      <JourneyCards />
      <GenuineSection />
      <SafetyHeader />
      <SafetyCards />
      
    </main>
  )
}

export default page