import React from 'react'
import AboutHeader from '@/components/about/header'
import BuiltSection from '@/components/about/built'
import MissionSection from '@/components/about/mission'
import WhyChooseSection from '@/components/about/why'
import ReadySection from '@/components/home/ready/ready'

function page() {
  return (
    <main>
      <AboutHeader />
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="2000"
        suppressHydrationWarning
      >
        <BuiltSection />
        <MissionSection />
      </div>
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="2000"
        suppressHydrationWarning
      >
        <WhyChooseSection />
      </div>
      <ReadySection description="Join MuslimNikah and take the first step towards a meaningful and blessed marriage." />
    </main>
  )
}

export default page