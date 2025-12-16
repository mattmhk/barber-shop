'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Scissors, Users, Clock, ArrowRight } from 'lucide-react'
import FadeScroll from '@/components/FadeScroll'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Barbers from '@/components/Barbers'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <Services />
      <Barbers />
      <Gallery />
      <Footer />
    </main>
  )
}

