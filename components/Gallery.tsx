'use client'

import Image from 'next/image'
import FadeScroll from './FadeScroll'

const galleryImages = [
  {
    url: '/pic1.jpg',
    alt: 'Barber at work',
  },
  {
    url: '/pic2.jpg',
    alt: 'Haircut in progress',
  },
  {
    url: '/pic3.jpg',
    alt: 'Beard styling',
  },
  {
    url: '/pic4.jpg',
    alt: 'Barber tools',
  },
  {
    url: '/pic5.jpg',
    alt: 'Barber shop interior',
  },
  {
    url: '/pic6.jpg',
    alt: 'Classic barber chair',
  },
]

export default function Gallery() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <FadeScroll key={index} delay={index * 100}>
              <div className="relative aspect-square overflow-hidden border-2 border-white/10 hover:border-white transition-all duration-500 group">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-all duration-500" />
              </div>
            </FadeScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

