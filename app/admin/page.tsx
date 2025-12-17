'use client'

import { useState, useEffect } from 'react'
import { supabase, Reservation, Service, Barber } from '@/lib/supabase'
import { Calendar, Clock, User, Mail, Phone, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import FadeScroll from '@/components/FadeScroll'

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'reservations'>('reservations')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  // Simple password protection (you should use proper auth in production)
  const ADMIN_PASSWORD = 'admin123' // Change this!

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      fetchData()
    } else {
      alert('Incorrect password')
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [reservationsRes, servicesRes, barbersRes] = await Promise.all([
        supabase
          .from('reservations')
          .select('*')
          .order('reservation_date', { ascending: false })
          .order('reservation_time', { ascending: false }),
        supabase.from('services').select('*').order('name'),
        supabase.from('barbers').select('*').order('name'),
      ])

      if (reservationsRes.data) setReservations(reservationsRes.data)
      if (servicesRes.data) setServices(servicesRes.data)
      if (barbersRes.data) setBarbers(barbersRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('Error updating reservation: ' + error.message)
    } else {
      fetchData()
    }
  }

  const deleteReservation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return

    const { error } = await supabase.from('reservations').delete().eq('id', id)

    if (error) {
      alert('Error deleting reservation: ' + error.message)
    } else {
      fetchData()
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <FadeScroll>
          <div className="max-w-md w-full">
            <h1 className="text-4xl font-black mb-8 text-center">ADMIN LOGIN</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-barber-gray border-2 border-white/30 p-4 focus:border-white focus:outline-none"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors"
              >
                LOGIN
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Default password: admin123 (change this in production!)
            </p>
          </div>
        </FadeScroll>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <FadeScroll>
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-black">ADMIN DASHBOARD</h1>
            <button
              onClick={() => {
                setAuthenticated(false)
                localStorage.removeItem('admin_authenticated')
              }}
              className="border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </FadeScroll>

        {/* Simple header for reservations */}
        <div className="mb-8 border-b border-white/20 pb-4">
          <h2 className="text-2xl font-bold">Reservations</h2>
          <p className="text-sm text-gray-400 mt-1">
            View all bookings. You can delete reservations if needed.
          </p>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <FadeScroll>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No reservations yet</p>
              ) : (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-barber-gray border-2 border-white/10 p-6 hover:border-white/30 transition-all"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          <span className="font-bold">{reservation.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{reservation.customer_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{reservation.customer_phone}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="font-bold">
                            {format(new Date(reservation.reservation_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{reservation.reservation_time}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Services:</p>
                        <p className="font-bold">
                          {reservation.service_ids.length} service(s)
                        </p>
                        <p className="text-sm text-gray-400 mb-2 mt-2">Barber:</p>
                        <p className="font-bold">
                          {barbers.find((b) => b.id === reservation.barber_id)?.name || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2">
                        <span className="inline-block px-3 py-1 border border-white/30 rounded text-xs uppercase tracking-wide text-gray-300">
                          {reservation.status}
                        </span>
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-2 text-sm hover:bg-red-500/30 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                    {reservation.notes && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400">Notes: {reservation.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </FadeScroll>
        )}

      </div>
    </div>
  )
}

