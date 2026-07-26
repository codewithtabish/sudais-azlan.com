import { BlogFormComp } from '@/components/app/(dashboard)/(blogs)/blog-from'
import { AppContainer } from '@/components/app/(layouts)/app-container'
import { Section } from '@/components/app/(layouts)/section-container'
import { AnimatedGlow } from '@/components/common/(themes)/anumated-glow'
import React from 'react'

const DashboardBlogCreationPage = () => {
  return (
    <>
    <Section>
      <AnimatedGlow/>
      <AppContainer>
        <BlogFormComp/>
      </AppContainer>
    </Section>
    
    </>
  )
}

export default DashboardBlogCreationPage
