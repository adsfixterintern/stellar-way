import FAQ from '@/components/home/FAQ'
import Reserve from '@/components/home/Reserve'
import React from 'react'
import AboutSection from '../_components/AboutSection'

export default function page() {
  return (
    <div>
      <Reserve></Reserve>


      <AboutSection/>
      <FAQ></FAQ>
    </div>
  )
}
