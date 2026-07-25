import { AppContainer } from '@/components/app/(layouts)/app-container'
import { Section } from '@/components/app/(layouts)/section-container'
import Link from 'next/link'
import React from 'react'

const DashboardBlogPage = () => {
  return (
    <>
    <Section>
        <AppContainer>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati ipsam voluptate nihil quia ad, iusto officiis possimus impedit rerum dolorum tempora sit aliquam necessitatibus nobis fuga esse ea id. Doloribus?
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Obcaecati ipsam voluptate nihil quia ad, iusto officiis possimus impedit rerum dolorum tempora sit aliquam necessitatibus nobis fuga esse ea id. Doloribus?

            <hr />
            <Link href={'/dashboard/blogs/create'}>
            Create a Blog
            </Link>

        </AppContainer>
    </Section>
      
    </>
  )
}

export default DashboardBlogPage
