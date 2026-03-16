import FAQ from '@/components/home/FAQ'
import Reserve from '@/components/home/Reserve'
import React from 'react'
import AboutSection from '../_components/AboutSection'
import Exp from '@/components/home/Exp'

export default function page() {
  return (
    <div>
      <AboutSection />
      <Exp></Exp>
      <Reserve></Reserve>
      <FAQ></FAQ>
    </div>
  )
}
