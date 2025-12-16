'use client'

import Image from 'next/image'
import FadeScroll from './FadeScroll'
import { supabase, Barber } from '@/lib/supabase'
import { useEffect, useState } from 'react'

// Default images for barbers if not set in database
const getDefaultBarberImage = (barberName: string) => {
  const name = barberName.toLowerCase()
  if (name === 'gaven') return '/gaven.jpg'
  if (name === 'marcus') return '/marcus.jpg'
  if (name === 'jake') return '/jake.jpg'
  return '/gaven.jpg' // fallback
}

export default function Barbers() {
  const [barbers, setBarbers] = useState<Barber[]>([])

  useEffect(() => {
    fetchBarbers()
  }, [])

  const fetchBarbers = async () => {
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching barbers:', error)
    } else {
      setBarbers(data || [])
    }
  }

  const defaultBarbers: Barber[] = [
    {
      id: '1',
      name: 'Gaven',
      bio: 'Master barber with 15 years of experience. Specializes in classic cuts and fades.',
      specialties: ['Classic Cuts', 'Fades', 'Beard Styling'],
      image_url: '/gaven.jpg',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Marcus',
      bio: 'Expert in modern styles and precision cuts. Known for attention to detail.',
      specialties: ['Modern Styles', 'Precision Cuts', 'Hair Design'],
      image_url: '/marcus.jpg',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Jake',
      bio: 'Traditional barber specializing in hot towel shaves and classic grooming.',
      specialties: ['Hot Towel Shaves', 'Traditional Cuts', 'Beard Trims'],
      image_url: '/jake.jpg',
      created_at: new Date().toISOString(),
    },
  ]

  const displayBarbers = barbers.length > 0 ? barbers : defaultBarbers

  return (
    <section className="py-24 px-4 bg-barber-gray">
      <div className="max-w-7xl mx-auto">
        <FadeScroll>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">MEET THE TEAM</h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
        </FadeScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayBarbers.map((barber, index) => (
            <FadeScroll key={barber.id} delay={index * 100}>
              <div className="text-center group">
                <div className="relative w-64 h-64 mx-auto mb-6 overflow-hidden border-4 border-white">
                  <Image
                    src={barber.image_url || getDefaultBarberImage(barber.name)}
                    alt={barber.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    style={
                      barber.name.toLowerCase() === 'marcus'
                        ? { objectPosition: 'center 30%' }
                        : { objectPosition: 'center center' }
                    }
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{barber.name}</h3>
                <p className="text-gray-400 mb-4">{barber.bio}</p>
                {barber.specialties && barber.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {barber.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 border border-white/30 bg-black/50"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </FadeScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

