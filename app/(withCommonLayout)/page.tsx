import FAQ from '@/components/home/FAQ'
import React from 'react'
import AboutSection from '../_components/AboutSection'
import HotDeliciousItem from '@/components/home/HotDeliciousItem'
import OurExquisiteMenu from '@/components/home/OurExquisiteMenu'

export default function page() {
  return (
    <div>


      <AboutSection/>
      <HotDeliciousItem></HotDeliciousItem>
      <OurExquisiteMenu></OurExquisiteMenu>
      <FAQ></FAQ>
    </div>
  )
}
