# Developer Portfolio

A modern, cinematic developer portfolio built with Next.js 14, TypeScript, and TailwindCSS.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui** components
- **next-intl** - Internationalization (EN, RU, RO)
- **Lenis** - Smooth scroll
- **Framer Motion** - Animations
- **GSAP + ScrollTrigger** - Scroll animations

## Project Structure

```
/app              - App Router pages
/components       - Reusable UI components
  /ui           - shadcn/ui components
  /sections     - Page sections (Hero, About, Skills, etc.)
  /layout       - Header, Footer
  /providers    - Lenis, etc.
/hooks           - Custom React hooks
/animations      - Animation variants
/lib             - Utilities
/prisma          - Database schema (ready for future use)
/messages        - i18n translations (en, ru, ro)
/i18n            - next-intl configuration
```

## Pages

- **Home** (`/`) - Cinematic hero with sections: Hero, About, Skills, Featured Projects, Experience, Contact
- **About** (`/about`)
- **Portfolio** (`/portfolio`)
- **Portfolio Detail** (`/portfolio/[slug]`)
- **Contact** (`/contact`)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000). The app will redirect to `/en` (default locale).

## Internationalization

Full i18n support via next-intl. Translation files in `/messages/`:
- `en.json` - English
- `ru.json` - Russian  
- `ro.json` - Romanian

Translated sections: navigation, hero, about, skills, projects, experience, contact, footer.

**Project translations**: Projects support database-backed translations. In admin, add title and description for each locale (EN, RU, RO). The portfolio displays projects in the current language.

## Design

Dark, minimal, cinematic theme with:
- Smooth Lenis scroll
- GSAP ScrollTrigger animations
- Framer Motion transitions
- Responsive layout

## Admin Dashboard

Protected admin area at `/admin` for managing portfolio projects.

### Setup

1. Create `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Set `DATABASE_URL` for PostgreSQL and `NEXTAUTH_SECRET` (min 32 chars).

3. Push schema and seed admin user:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Default admin: `admin@example.com` / `admin123` (override with `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars).

### Admin Routes

- `/admin` - Dashboard
- `/admin/login` - Sign in
- `/admin/projects` - Projects list
- `/admin/projects/create` - Create project
- `/admin/projects/[id]/edit` - Edit project

### Project Fields

- title, slug, description
- technologies (array)
- images (array of URLs)
- videoUrl, githubUrl, liveUrl
- featured (boolean)
