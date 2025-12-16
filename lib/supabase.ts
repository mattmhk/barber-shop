import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Service {
  id: string
  name: string
  description: string
  duration: number // in minutes
  price: number
  image_url?: string
  created_at: string
}

export interface Barber {
  id: string
  name: string
  bio: string
  image_url?: string
  specialties?: string[]
  created_at: string
}

export interface Reservation {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  barber_id: string
  service_ids: string[]
  reservation_date: string
  reservation_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  barber?: Barber
  services?: Service[]
}

