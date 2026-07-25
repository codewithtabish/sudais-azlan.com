import { About3 } from '@/components/about3'
import { AboutSectionPage } from '@/components/app/(about)/about-page-section'
import { AppContainer } from '@/components/app/(layouts)/app-container'
import { Section } from '@/components/app/(layouts)/section-container'
import { SectionHeader } from '@/components/common/(headers)/section-header'
import { AnimatedGlow } from '@/components/common/(themes)/anumated-glow'
import React from 'react'

const AboutPage = () => {
  return (
    <div>
      <AnimatedGlow/>
        <AppContainer>
            <Section className=''>
          {/* <SectionHeader
  title="The Story Behind the Code"
  description="Discover my journey as a Full-Stack Software Engineer, the technologies I work with, the values that guide my development process, and the passion that drives me to build exceptional digital experiences."
/> */}
<About3/>
              {/* <AboutSectionPage/> */}
            
           
            </Section>

        </AppContainer>
      
    </div>
  )
}

export default AboutPage
