'use client'

import { useState, useEffect } from 'react'
import { supabase, Service, Barber, Reservation } from '@/lib/supabase'
import { Calendar, Clock, User, Scissors, Check } from 'lucide-react'
import { format, addDays, isSameDay, isBefore } from 'date-fns'
import FadeScroll from '@/components/FadeScroll'

// Thailand timezone (UTC+7)
const THAILAND_OFFSET = 7 * 60 * 60 * 1000 // 7 hours in milliseconds

// Shop closing time in minutes from midnight (19:00 in Thailand)
const CLOSING_TIME_MINUTES = 19 * 60

// Get current time in Thailand
const getThailandTime = (): Date => {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000
  return new Date(utc + THAILAND_OFFSET)
}

// Get start of today in Thailand time
const getThailandToday = (): Date => {
  const thailandNow = getThailandTime()
  return new Date(thailandNow.getFullYear(), thailandNow.getMonth(), thailandNow.getDate())
}

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedBarber, setSelectedBarber] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([])
  const [loadingReservations, setLoadingReservations] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Fetch existing reservations when date or barber changes
  useEffect(() => {
    if (selectedDate && selectedBarber) {
      fetchExistingReservations()
    } else {
      setExistingReservations([])
    }
  }, [selectedDate, selectedBarber])

  const fetchData = async () => {
    const [servicesRes, barbersRes] = await Promise.all([
      supabase.from('services').select('*').order('name'),
      supabase.from('barbers').select('*').order('name'),
    ])

    if (servicesRes.data) setServices(servicesRes.data)
    if (barbersRes.data) setBarbers(barbersRes.data)
  }

  const fetchExistingReservations = async () => {
    if (!selectedDate || !selectedBarber) {
      setExistingReservations([])
      return
    }

    setLoadingReservations(true)
    const dateString = format(selectedDate, 'yyyy-MM-dd')

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('barber_id', selectedBarber)
      .eq('reservation_date', dateString)
      .in('status', ['pending', 'confirmed'])

    if (error) {
      console.error('Error fetching reservations:', error)
      setExistingReservations([])
    } else {
      const reservations = data || []
      setExistingReservations(reservations)
      console.log(`Fetched ${reservations.length} reservations for ${dateString}, barber ${selectedBarber}:`, reservations.map(r => ({ time: r.reservation_time, status: r.status })))
    }
    setLoadingReservations(false)
  }

  // Normalize time string to HH:MM format
  const normalizeTime = (timeStr: string | null | undefined): string => {
    if (!timeStr) return ''
    // Remove any seconds or milliseconds (e.g., "09:00:00" -> "09:00", "9:0" -> "09:00")
    const trimmed = timeStr.toString().trim()
    const parts = trimmed.split(':')
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10).toString().padStart(2, '0')
      const minutes = parseInt(parts[1], 10).toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }
    return trimmed
  }

  const timeStringToMinutes = (time: string | null | undefined): number => {
    const normalized = normalizeTime(time)
    if (!normalized) return 0
    const [hours, minutes] = normalized.split(':').map((v) => parseInt(v, 10))
    return hours * 60 + minutes
  }

  // Total duration for a list of service IDs (from DB)
  const getTotalDurationForServiceIds = (ids: string[] | null | undefined): number => {
    if (!ids || !Array.isArray(ids)) return 0
    return ids.reduce((sum, id) => {
      const service = services.find((s) => s.id === id)
      return sum + (service?.duration || 0)
    }, 0)
  }

  // Total duration for currently selected services
  const getSelectedServicesDuration = (): number => {
    return selectedServices.reduce((sum, id) => {
      const service = services.find((s) => s.id === id)
      return sum + (service?.duration || 0)
    }, 0)
  }

  // Normalize time string to HH:MM format
  // Check if a time slot is available
  const isTimeSlotAvailable = (time: string): boolean => {
    if (!selectedDate || !selectedBarber) return false

    // Need at least one service selected to know duration
    const selectedDuration = getSelectedServicesDuration()
    if (selectedDuration <= 0) return false

    const slotStartMinutes = timeStringToMinutes(time)
    const slotEndMinutes = slotStartMinutes + selectedDuration

    // Do not allow booking that goes past closing time
    if (slotEndMinutes > CLOSING_TIME_MINUTES) {
      return false
    }

    // Check if time is in the past (for today) - using Thailand time
    const thailandToday = getThailandToday()
    if (isSameDay(selectedDate, thailandToday)) {
      const thailandNow = getThailandTime()
      const nowMinutes =
        thailandNow.getHours() * 60 + thailandNow.getMinutes()
      if (slotStartMinutes <= nowMinutes) {
        return false
      }
    }

    // Check if time slot conflicts with existing reservations,
    // taking into account the duration of each reservation.
    const hasOverlap = existingReservations.some((res) => {
      if (!res.reservation_time) return false

      const resStartMinutes = timeStringToMinutes(res.reservation_time)
      const resDuration = getTotalDurationForServiceIds(
        (res as any).service_ids as string[]
      )
      if (resDuration <= 0) return false

      const resEndMinutes = resStartMinutes + resDuration

      // Overlap if intervals intersect: [slotStart, slotEnd) and [resStart, resEnd)
      return (
        slotStartMinutes < resEndMinutes && slotEndMinutes > resStartMinutes
      )
    })

    return !hasOverlap
  }

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30',
  ]

  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const thailandToday = getThailandToday()
    return addDays(thailandToday, i)
  })

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || selectedServices.length === 0 || !selectedBarber) {
      alert('Please complete all steps')
      return
    }

    // Ensure the selected time with the chosen services fits before closing time
    const selectedDuration = getSelectedServicesDuration()
    const slotStartMinutes = timeStringToMinutes(selectedTime)
    const slotEndMinutes = slotStartMinutes + selectedDuration
    if (slotEndMinutes > CLOSING_TIME_MINUTES) {
      alert('This service is too long to start at this time. Please choose an earlier time.')
      return
    }

    // Double-check availability before submitting
    if (!isTimeSlotAvailable(selectedTime)) {
      alert('This time slot is no longer available. Please select another time.')
      return
    }

    setIsSubmitting(true)

    const reservationDate = format(selectedDate, 'yyyy-MM-dd')

    const { data, error } = await supabase
      .from('reservations')
      .insert({
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        barber_id: selectedBarber,
        service_ids: selectedServices,
        reservation_date: reservationDate,
        reservation_time: selectedTime,
        status: 'pending',
        notes: customerInfo.notes,
      })
      .select()

    setIsSubmitting(false)

    if (error) {
      alert('Error creating reservation: ' + error.message)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <FadeScroll>
          <div className="text-center max-w-md">
            <div className="w-20 h-20 border-4 border-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black mb-4">RESERVATION CONFIRMED</h1>
            <p className="text-gray-400 mb-8">
              We&apos;ve received your booking request. You&apos;ll receive a confirmation email shortly.
            </p>
            <a
              href="/"
              className="inline-block bg-white text-black px-8 py-4 font-bold hover:bg-gray-200 transition-colors"
            >
              RETURN HOME
            </a>
          </div>
        </FadeScroll>
      </div>
    )
  }

  const selectedServicesData = services.filter((s) => selectedServices.includes(s.id))
  const totalDuration = selectedServicesData.reduce((sum, s) => sum + s.duration, 0)
  const totalPrice = selectedServicesData.reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeScroll>
          <h1 className="text-5xl md:text-6xl font-black mb-12 text-center">BOOK YOUR APPOINTMENT</h1>
        </FadeScroll>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-6 h-1 bg-white/20" />

            <div className="grid grid-cols-4 text-center">
              {[
                { step: 1, label: 'Services' },
                { step: 2, label: 'Barber' },
                { step: 3, label: 'Date & Time' },
                { step: 4, label: 'Details' },
              ].map(({ step: s, label }) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-white text-black border-white'
                        : 'bg-black border-white/30 text-white/30'
                    }`}
                  >
                    {s}
                  </div>

                  <span
                    className={`text-sm ${
                      step >= s ? 'text-gray-400' : 'text-white/30'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <form onSubmit={handleSubmit}>
          {/* Step 1: Services */}
          {step === 1 && (
            <FadeScroll>
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Scissors className="w-8 h-8" />
                  SELECT SERVICES
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-6 border-2 text-left transition-all ${
                          selectedServices.includes(service.id)
                            ? 'border-white bg-white text-black'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold">{service.name}</h3>
                          <span className="font-bold">${service.price}</span>
                        </div>
                        <p className="text-sm opacity-70 mb-2">{service.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} minutes</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400">Loading services...</p>
                  )}
                </div>
                {selectedServices.length > 0 && (
                  <div className="bg-barber-gray p-4 mb-8">
                    <p className="text-sm text-gray-400 mb-2">Selected Services:</p>
                    <div className="space-y-1">
                      {selectedServicesData.map((s) => (
                        <div key={s.id} className="flex justify-between">
                          <span>{s.name}</span>
                          <span>${s.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/20 mt-4 pt-4 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={selectedServices.length === 0}
                  className="w-full bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CONTINUE
                </button>
              </div>
            </FadeScroll>
          )}

          {/* Step 2: Barber */}
          {step === 2 && (
            <FadeScroll>
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <User className="w-8 h-8" />
                  CHOOSE YOUR BARBER
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {barbers.length > 0 ? (
                    barbers.map((barber) => (
                      <button
                        key={barber.id}
                        type="button"
                        onClick={() => setSelectedBarber(barber.id)}
                        className={`p-6 border-2 text-center transition-all ${
                          selectedBarber === barber.id
                            ? 'border-white bg-white text-black'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-2">{barber.name}</h3>
                        <p className="text-sm opacity-70">{barber.bio}</p>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-400">Loading barbers...</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-white py-4 font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!selectedBarber}
                    className="flex-1 bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </FadeScroll>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <FadeScroll>
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  SELECT DATE & TIME
                </h2>
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Choose Date</h3>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
                    {availableDates.map((date) => (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => {
                          setSelectedDate(date)
                          setSelectedTime('') // Reset selected time when date changes
                          // Fetch reservations will be triggered by useEffect
                        }}
                        className={`p-3 border-2 text-sm transition-all ${
                          selectedDate && isSameDay(date, selectedDate)
                            ? 'border-white bg-white text-black'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <div>{format(date, 'EEE')}</div>
                        <div className="font-bold">{format(date, 'd')}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {selectedDate && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Choose Time</h3>
                    {loadingReservations ? (
                      <p className="text-gray-400">Loading available times...</p>
                    ) : (
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                        {timeSlots.map((time) => {
                          const isAvailable = isTimeSlotAvailable(time)
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                if (isAvailable) {
                                  setSelectedTime(time)
                                }
                              }}
                              disabled={!isAvailable}
                              className={`p-3 border-2 transition-all ${
                                !isAvailable
                                  ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed'
                                  : selectedTime === time
                                  ? 'border-white bg-white text-black'
                                  : 'border-white/30 hover:border-white/60'
                              }`}
                              title={isAvailable ? 'Available' : 'This time slot is not available'}
                            >
                              {time}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border-2 border-white py-4 font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </FadeScroll>
          )}

          {/* Step 4: Customer Info */}
          {step === 4 && (
            <FadeScroll>
              <div>
                <h2 className="text-3xl font-bold mb-6">YOUR INFORMATION</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      className="w-full bg-barber-gray border-2 border-white/30 p-4 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, email: e.target.value })
                      }
                      className="w-full bg-barber-gray border-2 border-white/30 p-4 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      className="w-full bg-barber-gray border-2 border-white/30 p-4 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, notes: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-barber-gray border-2 border-white/30 p-4 focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-barber-gray p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4">RESERVATION SUMMARY</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Services:</span>
                      <span>{selectedServicesData.map((s) => s.name).join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Barber:</span>
                      <span>
                        {barbers.find((b) => b.id === selectedBarber)?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span>{selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span>{selectedTime || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span>{totalDuration} minutes</span>
                    </div>
                    <div className="border-t border-white/20 mt-4 pt-4 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 border-2 border-white py-4 font-bold hover:bg-white hover:text-black transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
                    className="flex-1 bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'CONFIRM RESERVATION'}
                  </button>
                </div>
              </div>
            </FadeScroll>
          )}
        </form>
      </div>
    </div>
  )
}

