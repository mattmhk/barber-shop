# Supabase Setup Guide for Gaven's Barber Shop

This guide will walk you through setting up Supabase for your barber shop website.

## What is Supabase?

Supabase is a backend-as-a-service (BaaS) platform that provides:
- **Database**: PostgreSQL database (no need for a separate backend server!)
- **Authentication**: User authentication (if you want to add it later)
- **Storage**: File storage for images
- **Real-time**: Real-time database updates

Since you're hosting on Vercel, Supabase is perfect because it handles all the backend functionality - you don't need a separate backend server!

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with your GitHub account (recommended) or email
4. Create a new organization if prompted

## Step 2: Create a New Project

1. Click "New Project" in your Supabase dashboard
2. Fill in the project details:
   - **Name**: `gavens-barber-shop` (or any name you prefer)
   - **Database Password**: Create a strong password (save this somewhere safe!)
   - **Region**: Choose the region closest to you/your customers
   - **Pricing Plan**: Free tier is fine to start
3. Click "Create new project"
4. Wait 2-3 minutes for your project to be set up

## Step 3: Get Your API Keys

1. Once your project is ready, go to **Settings** (gear icon in the left sidebar)
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 4: Set Up Your Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click "New query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents of that file
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This will create:
- `services` table (for your barber services)
- `barbers` table (for your barber team)
- `reservations` table (for customer bookings)
- Sample data to get you started

## Step 5: Configure Environment Variables

1. In your project root, create a file called `.env.local`
2. Add the following (replace with your actual values from Step 3):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Important**: Never commit `.env.local` to Git (it's already in `.gitignore`)

## Step 6: Set Up Environment Variables on Vercel

When you deploy to Vercel:

1. Go to your Vercel project settings
2. Click on **Environment Variables**
3. Add the same three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Make sure to add them for all environments (Production, Preview, Development)

## Step 7: Verify Your Setup

1. Run `npm install` in your project
2. Run `npm run dev` to start the development server
3. Visit `http://localhost:3000`
4. Try booking an appointment at `http://localhost:3000/book`
5. Check the admin page at `http://localhost:3000/admin` (password: `admin123`)

## Managing Your Data

### Viewing Data

1. In Supabase dashboard, click **Table Editor** in the left sidebar
2. You'll see your tables: `services`, `barbers`, `reservations`
3. Click on any table to view and edit data

### Adding Services

1. Go to **Table Editor** → `services`
2. Click "Insert row"
3. Fill in:
   - `name`: Service name (e.g., "Haircut & Beard")
   - `description`: Service description
   - `duration`: Duration in minutes (e.g., 60)
   - `price`: Price in dollars (e.g., 45.00)
   - `image_url`: (Optional) URL to an image
4. Click "Save"

### Adding Barbers

1. Go to **Table Editor** → `barbers`
2. Click "Insert row"
3. Fill in:
   - `name`: Barber's name
   - `bio`: Short bio
   - `image_url`: (Optional) URL to barber's photo
   - `specialties`: Click the array icon and add specialties like "Fades", "Beard Styling", etc.
4. Click "Save"

### Viewing Reservations

1. Go to **Table Editor** → `reservations`
2. You'll see all customer bookings
3. You can edit the `status` field directly here, or use the admin page

## Security Notes

⚠️ **Important for Production:**

1. **Change the admin password**: In `app/admin/page.tsx`, change the `ADMIN_PASSWORD` constant
2. **Add proper authentication**: The current admin page uses a simple password. For production, consider:
   - Using Supabase Auth for proper user authentication
   - Restricting admin access to specific email addresses
   - Using environment variables for the admin password
3. **Row Level Security (RLS)**: The current setup allows public access. For production, you might want to:
   - Restrict reservation updates/deletes to authenticated admin users only
   - Use Supabase Auth to manage admin users

## Troubleshooting

### "Missing Supabase environment variables" error

- Make sure `.env.local` exists and has all three variables
- Restart your dev server after adding environment variables
- Check that variable names match exactly (case-sensitive)

### Can't see data in the app

- Check the Supabase dashboard to see if data exists in the tables
- Open browser console (F12) to see any errors
- Verify your API keys are correct

### Reservations not saving

- Check browser console for errors
- Verify RLS policies are set up correctly (run the schema.sql again)
- Make sure the `barber_id` and `service_ids` exist in your database

## Next Steps

- Add image upload functionality using Supabase Storage
- Set up email notifications for new reservations
- Add calendar integration
- Implement proper authentication for admin users
- Add analytics and reporting

## Need Help?

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)

