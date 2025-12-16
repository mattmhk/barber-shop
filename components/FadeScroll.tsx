'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface FadeScrollProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function FadeScroll({ children, className = '', delay = 0 }: FadeScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`fade-scroll ${isVisible ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

