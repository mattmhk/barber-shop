'use client'

import { Scissors, Clock, Sparkles, Sparkle, Package, Waves } from 'lucide-react'
import FadeScroll from './FadeScroll'
import { supabase, Service } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching services:', error)
    } else {
      setServices(data || [])
    }
  }

  const defaultServices: Service[] = [
    {
      id: '1',
      name: 'Classic Cut',
      description: 'Traditional barber cut with modern precision',
      duration: 30,
      price: 35,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Fade & Style',
      description: 'Premium fade with styling and finish',
      duration: 45,
      price: 50,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Beard Trim',
      description: 'Professional beard shaping and trimming',
      duration: 20,
      price: 25,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Hot Towel Shave',
      description: 'Luxurious traditional hot towel shave',
      duration: 30,
      price: 40,
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Full Service',
      description: 'Cut, beard trim, and hot towel shave',
      duration: 75,
      price: 90,
      created_at: new Date().toISOString(),
    },
  ]

  const displayServices = services.length > 0 ? services : defaultServices

  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <FadeScroll>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">OUR SERVICES</h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
        </FadeScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
            // Get appropriate icon for each service
            const getServiceIcon = (serviceName: string) => {
              const name = serviceName.toLowerCase()
              if (name.includes('cut') || name.includes('fade')) {
                return <Scissors className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              } else if (name.includes('beard')) {
                return <Sparkle className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              } else if (name.includes('shave')) {
                return <Waves className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              } else if (name.includes('full') || name.includes('service')) {
                return <Package className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
              }
              return <Scissors className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            }

            return (
              <FadeScroll key={service.id} delay={index * 100}>
                <div className="bg-barber-gray border border-white/10 p-8 hover:border-white transition-all duration-300 group">
                  {getServiceIcon(service.name)}
                  <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="font-bold">
                      <span>${service.price}</span>
                    </div>
                  </div>
                </div>
              </FadeScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

