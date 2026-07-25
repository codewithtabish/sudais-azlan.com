import { TestimonialsSection } from '@/components/app/(landing)/(testmonial)/testmonial-section'
import AboutSection from '@/components/app/(landing)/about-us-section'
import { HeroSection } from '@/components/app/(landing)/hero-section'
import { ServicesSection } from '@/components/app/(landing)/our-services-section'
import { AppContainer } from '@/components/app/(layouts)/app-container'
import { Section } from '@/components/app/(layouts)/section-container'
import Footer from '@/components/common/(footer)/footer'
import { AnimatedGlow } from '@/components/common/(themes)/anumated-glow'
import React from 'react'

const HoemLandingPage = () => {
  return (
   <>
   <AnimatedGlow/>
   
   <Section>

    <AppContainer>
      <HeroSection/>
    </AppContainer>

   </Section>
   <Section>
    <AppContainer>
      <AboutSection/>
    </AppContainer>
   </Section>

   <Section>
    <AppContainer>
      <ServicesSection/>
    </AppContainer>
   </Section>

   <Section>
    <TestimonialsSection/>
   </Section>

  



  

 
    
   </>
  )
}

export default HoemLandingPage

// "business headshot" — clean, professional, corporate look
// "portrait professional" — similar, slightly more varied backgrounds
// "smiling professional portrait" — friendlier, less stiff
// "studio portrait" — plain background, easiest to crop square consistentlyb