-- Gaven's Barber Shop Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Barbers table
CREATE TABLE IF NOT EXISTS barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT,
  specialties TEXT[], -- Array of specialty strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  service_ids UUID[] NOT NULL, -- Array of service IDs
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to services and barbers
CREATE POLICY "Allow public read access to services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to barbers"
  ON barbers FOR SELECT
  USING (true);

-- Policies: Allow public insert for reservations (customers can book)
CREATE POLICY "Allow public insert for reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

-- Policies: Allow public read access to reservations (for admin, you might want to restrict this)
-- For now, we'll allow read but you should add proper authentication
CREATE POLICY "Allow public read access to reservations"
  ON reservations FOR SELECT
  USING (true);

-- Policies: Allow public update/delete for reservations (for admin)
-- In production, you should restrict this to authenticated admin users only
CREATE POLICY "Allow public update for reservations"
  ON reservations FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete for reservations"
  ON reservations FOR DELETE
  USING (true);

-- Insert sample data
INSERT INTO services (name, description, duration, price) VALUES
  ('Classic Cut', 'Traditional barber cut with modern precision', 30, 35.00),
  ('Fade & Style', 'Premium fade with styling and finish', 45, 50.00),
  ('Beard Trim', 'Professional beard shaping and trimming', 20, 25.00),
  ('Hot Towel Shave', 'Luxurious traditional hot towel shave', 30, 40.00),
  ('Full Service', 'Cut, beard trim, and hot towel shave', 75, 90.00);

INSERT INTO barbers (name, bio, specialties) VALUES
  ('Gaven', 'Master barber with 15 years of experience. Specializes in classic cuts and fades.', ARRAY['Classic Cuts', 'Fades', 'Beard Styling']),
  ('Marcus', 'Expert in modern styles and precision cuts. Known for attention to detail.', ARRAY['Modern Styles', 'Precision Cuts', 'Hair Design']),
  ('Jake', 'Traditional barber specializing in hot towel shaves and classic grooming.', ARRAY['Hot Towel Shaves', 'Traditional Cuts', 'Beard Trims']);

