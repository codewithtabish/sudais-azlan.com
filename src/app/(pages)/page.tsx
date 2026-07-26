import { FeaturedBlogsList } from '@/components/app/(landing)/(featured-blog)/featured-blog-list'
import { FeaturedBlogsListSkeleton } from '@/components/app/(landing)/(featured-blog)/featured-blogs-skeleton'
import { TestimonialsSection } from '@/components/app/(landing)/(testmonial)/testmonial-section'
import AboutSection from '@/components/app/(landing)/about-us-section'
import { HeroSection } from '@/components/app/(landing)/hero-section'
import { ServicesSection } from '@/components/app/(landing)/our-services-section'
import { AppContainer } from '@/components/app/(layouts)/app-container'
import { Section } from '@/components/app/(layouts)/section-container'
import { SectionHeader } from '@/components/common/(headers)/section-header'
import { AnimatedGlow } from '@/components/common/(themes)/anumated-glow'
import { cacheLife, cacheTag } from 'next/cache'
// import { cacheTag } from 'next/cache'
import React, { Suspense } from 'react'

  const  HoemLandingPage = async () => {
  'use cache'
  cacheTag("home-page");
  cacheLife("max")
  console.log("🏠 HOME PAGE RENDERED");


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
    <AppContainer>
<SectionHeader
  badge="Featured Articles"
  title="Featured Blogs"
  description="Explore our latest hand-picked articles covering software engineering, AI, cloud architecture, web development, and modern technologies."
/>       <Suspense fallback={<FeaturedBlogsListSkeleton />}>
      <FeaturedBlogsList />
    </Suspense>
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