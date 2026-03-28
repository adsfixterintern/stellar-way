import Baneer from '@/components/home/Baneer'
import FAQ from '@/components/home/FAQ'
import Reserve from '@/components/home/Reserve'
import React from 'react'
import AboutSection from './about-us/_components/AboutSection'
import HotDeliciousItem from '@/components/home/HotDeliciousItem'
import OurExquisiteMenu from '@/components/home/OurExquisiteMenu'
import Exp from '@/components/home/Exp'
import LatestBlogs from '@/components/home/LatestBlogs'

export default function page() {
  return (
    <div>


      <Baneer></Baneer>
      <AboutSection />
      <HotDeliciousItem></HotDeliciousItem>
      <OurExquisiteMenu></OurExquisiteMenu>
      <Exp></Exp>
      <Reserve></Reserve>
      <LatestBlogs></LatestBlogs>
      <FAQ></FAQ>
    </div>
  )
}
