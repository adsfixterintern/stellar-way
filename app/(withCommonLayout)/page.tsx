import Baneer from '@/components/home/Baneer'
import FAQ from '@/components/home/FAQ'
import Reserve from '@/components/home/Reserve'
import React from 'react'
import AboutSection from './about-us/_components/AboutSection'
import HotDeliciousItem from '@/components/home/HotDeliciousItem'
import OurExquisiteMenu from '@/components/home/OurExquisiteMenu'
import Exp from '@/components/home/Exp'
import LatestBlogs from '@/components/home/LatestBlogs'
import Feedback from '@/components/home/Feedback'
import OfferSection from '@/components/home/OfferSection'
import Testimonial from '@/components/Testimonial'

export default function page() {
  return (
    <div>


      <Baneer></Baneer>
      <OfferSection/>
      <AboutSection />
      <HotDeliciousItem></HotDeliciousItem>
      <OurExquisiteMenu></OurExquisiteMenu>
      <Exp></Exp>
      <Testimonial/>
      <Reserve></Reserve>
      <LatestBlogs></LatestBlogs>
      <FAQ></FAQ>
    </div>
  )
}
