import { About3 } from '@/components/about3'
import { AppContainer } from '@/components/app/(layouts)/app-container'
import { Section } from '@/components/app/(layouts)/section-container'
import { AnimatedGlow } from '@/components/common/(themes)/anumated-glow'
import { BackButton } from '@/components/common/back-button'
import React from 'react'

const AboutPage = () => {
  return (
    <div>
     

      <AnimatedGlow/>
        <AppContainer>
            <Section>
          <BackButton/>

<About3
className='mt-10'
  title="The Story Behind the Code"
    description="Discover my journey as a Full-Stack Software Engineer, the technologies I work with, the values that guide my development process, and the passion that drives me to build exceptional digital experiences."


/>
              {/* <AboutSectionPage/> */}
            
           
            </Section>

        </AppContainer>
      
    </div>
  )
}

export default AboutPage
