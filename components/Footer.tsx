'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-barber-gray border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">GAVEN&apos;S BARBER SHOP</h3>
            <p className="text-gray-400">
              Where style meets edge. Experience premium grooming in an atmosphere
              that&apos;s as bold as your look.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">HOURS</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Mon - Fri: 9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Sat: 8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Sun: Closed</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">CONTACT</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>123 Main Street, City, State 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@gavensbarbershop.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Gaven&apos;s Barber Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

