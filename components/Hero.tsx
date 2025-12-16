'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import FadeScroll from './FadeScroll'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10" />
        <Image
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&h=1080&fit=crop"
          alt="Barber shop interior"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
        <FadeScroll>
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-all duration-500"></div>
              <Image
                src="/logo.png"
                alt="Gaven's Barber Shop Logo"
                width={280}
                height={280}
                className="relative opacity-60 grayscale-[0.8] hover:opacity-90 hover:grayscale-0 transition-all duration-700 transform hover:scale-110 drop-shadow-2xl"
                priority
              />
              <div className="absolute inset-0 border border-white/30 group-hover:border-white/60 transition-all duration-500"></div>
            </div>
          </div>
        </FadeScroll>

        <FadeScroll delay={200}>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            GAVEN&apos;S
          </h1>
        </FadeScroll>

        <FadeScroll delay={400}>
          <p className="text-2xl md:text-4xl font-light mb-12 tracking-wider">
            BARBER SHOP
          </p>
        </FadeScroll>

        <FadeScroll delay={600}>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-300">
            Where style meets edge. Experience premium grooming in an atmosphere
            that&apos;s as bold as your look.
          </p>
        </FadeScroll>

        <FadeScroll delay={800}>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-lg font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
          >
            BOOK NOW
            <ArrowRight className="w-5 h-5" />
          </Link>
        </FadeScroll>
      </div>
    </section>
  )
}

