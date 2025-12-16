# Gaven's Barber Shop Website

An edgy, black and white themed barber shop website with a modern reservation system.

## Features

- 🎨 **Edgy Black & White Design** - Matches the vintage barber shop aesthetic
- ✨ **Fade Scroll Animations** - Smooth scroll-triggered animations throughout
- 📅 **Reservation System** - Complete booking system similar to Fresha
  - Service selection
  - Barber selection
  - Date and time booking
  - Customer information collection
- 👨‍💼 **Admin Dashboard** - Manage reservations, view services and barbers
- 🖼️ **Gallery** - Showcase your work with aesthetic black and white images
- 🚀 **Vercel Ready** - Optimized for Vercel deployment
- 💾 **Supabase Backend** - No separate backend needed!

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend-as-a-service (database, no server needed!)
- **Framer Motion** - Smooth animations
- **date-fns** - Date manipulation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works!)

### Installation

1. **Clone or download this project**

2. **Move your logo**
   - Move `logo.png` from the root directory to the `public/` folder
   - The logo should be at `public/logo.png`

3. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create a Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Get your API keys

4. **Configure environment variables**
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard page
│   ├── book/           # Reservation booking page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Barbers.tsx     # Team section
│   ├── FadeScroll.tsx  # Scroll animation component
│   ├── Footer.tsx      # Footer component
│   ├── Gallery.tsx     # Image gallery
│   ├── Hero.tsx        # Hero section
│   └── Services.tsx    # Services section
├── lib/
│   └── supabase.ts     # Supabase client and types
├── supabase/
│   └── schema.sql      # Database schema
└── public/
    └── logo.png        # Your logo
```

## Pages

- **Home** (`/`) - Landing page with hero, services, barbers, and gallery
- **Book** (`/book`) - Multi-step reservation form
- **Admin** (`/admin`) - Admin dashboard for managing reservations

## Admin Access

- Default password: `admin123`
- **⚠️ Change this in production!** Edit `app/admin/page.tsx`

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all three Supabase variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**
   - Click "Deploy"
   - Your site will be live in minutes!

## Customization

### Changing Colors

Edit `tailwind.config.js` to modify the color scheme.

### Adding Services/Barbers

1. Use the Supabase dashboard (Table Editor)
2. Or use the admin page (once logged in)

### Modifying Images

- Replace gallery images in `components/Gallery.tsx`
- Add barber photos via Supabase (update `image_url` in barbers table)
- Update hero background image in `components/Hero.tsx`

## Important Notes

- **Environment Variables**: Never commit `.env.local` to Git
- **Admin Security**: The current admin uses a simple password. For production, implement proper authentication
- **Images**: Currently using Unsplash images. Replace with your own photos
- **Supabase**: Make sure to set up Row Level Security policies properly (included in schema.sql)

## Support

For Supabase setup help, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## License

This project is open source and available for your use.

---

Built with ❤️ for Gaven's Barber Shop
