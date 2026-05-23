# Glix

Glix is a mobile-first micro-SaaS/PWA for personal glucose tracking. It helps users register glucose measurements, visualize trends, filter their history and keep a clearer personal record over time.

Production: [https://glix-one.vercel.app/](https://glix-one.vercel.app/)  
Repository: [https://github.com/brunogiacomelli1979-cyber/Glix](https://github.com/brunogiacomelli1979-cyber/Glix)

> Glix is a personal tracking diary. It does not provide medical diagnosis, treatment advice or clinical recommendations.

## Status

Current status: portfolio-ready MVP.

The project already includes authentication, protected dashboard, CRUD for glucose records, visual classification, temporal filters, automatic insights, a basic evolution chart, centralized validation, reusable dashboard components and initial PWA support.

## Product Overview

Many people still track glucose readings using paper notes, spreadsheets or fragmented apps. Glix explores a calmer, clearer and more organized experience for personal glucose logging.

The product focuses on:

- quick glucose measurement registration;
- secure access with user accounts;
- organized history by period and context;
- simple visual trends;
- a mobile-first interface suitable for daily use.

Glix is intentionally not positioned as a clinical tool. It is a digital diary for personal organization and better conversations with healthcare professionals.

## AI-Assisted Development Approach

Glix was built using an AI-assisted development workflow, combining low-code/low-friction tools with real application code and modern engineering practices.

Tools used in the process:

- ChatGPT for mentoring, architecture decisions, documentation and product reasoning;
- Codex/Antigravity for code generation, refactoring and implementation support;
- Canva for visual identity and official assets;
- Supabase as backend-as-a-service;
- Vercel for deployment;
- GitHub for version control.

This is not a "100% no-code" project. The application includes real code written in Next.js, TypeScript, Server Actions, reusable components, centralized validation, Supabase integration and production deployment.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui style components
- Supabase Auth
- Supabase Database
- Row Level Security
- Vercel
- GitHub
- Canva
- ChatGPT/Codex assisted workflow

## Main Features

- Public landing page with official Glix branding
- Email/password authentication with Supabase Auth
- Protected dashboard
- Create, edit and delete glucose records
- Fields: glucose value, date/time, measurement context and notes
- Temporal filters: today, 7 days, 30 days and 90 days
- Context filter
- Glucose classification:
  - low: below 70 mg/dL
  - normal: 70 to 140 mg/dL
  - attention: 141 to 180 mg/dL
  - high: above 180 mg/dL
- Visual badges per record and summary card
- Automatic insights:
  - period average
  - high record count
  - trend
  - stability
- Evolution chart
- Centralized validation
- Mobile-first responsive UI
- Initial PWA manifest

## Screenshots and Assets

Official visual assets are stored in:

```text
public/branding/
```

Available assets include:

- `glix-logo-main.png`
- `glix-app-icon.png`
- `glix-splash-screen.png`
- `glix-landing-hero.png`
- `glix-dashboard-preview.png`

## Architecture Summary

The app uses the Next.js App Router with server-side data access through Supabase. The dashboard is protected by Supabase session handling and reads only the authenticated user's glucose records.

High-level flow:

```text
User -> Next.js App Router -> Server Actions / Server Components -> Supabase Auth + Database -> Dashboard UI
```

Key architectural decisions:

- Server Actions handle mutations.
- Server Components fetch protected dashboard data.
- Supabase Auth manages user identity.
- Supabase Row Level Security isolates user data.
- Dashboard UI is split into reusable components.
- Glucose rules and validation are centralized in `src/lib/glucose.ts`.
- Shared types live in `src/types/glucose.ts`.

## Security and Privacy

Glix uses Supabase Auth and Row Level Security to keep each user's records isolated.

Current security practices:

- authenticated routes for private dashboard access;
- user-specific queries;
- RLS policies in Supabase;
- no service role key in the frontend;
- public anon/publishable key only;
- centralized input validation;
- `.env.local` excluded from version control.

See [SECURITY.md](./SECURITY.md) for more details.

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Do not commit real environment values.

3. Configure Supabase using:

```text
SUPABASE_SETUP.md
```

4. Start development server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Useful Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

```text
src/app/
  page.tsx                 Public landing page
  login/page.tsx           Login page
  register/page.tsx        Registration page
  dashboard/page.tsx       Protected dashboard
  dashboard/actions.ts     Server Actions for glucose records
  auth/actions.ts          Authentication actions

src/components/dashboard/  Dashboard components
src/components/ui/         Base UI components
src/lib/glucose.ts         Glucose rules, metrics and validation
src/types/glucose.ts       Shared glucose types
src/utils/supabase/        Supabase clients and session helpers
public/branding/           Official visual assets
```

## Roadmap

Short-term:

- improve PWA installation experience;
- add richer chart interactions;
- polish mobile states and empty states;
- improve user-facing error messages.

Medium-term:

- export CSV/PDF reports;
- profile settings;
- account deletion flow;
- privacy policy page;
- production analytics and monitoring.

Future premium ideas:

- advanced reports;
- longer history and exports;
- reminders;
- integrations with automation tools;
- optional caregiver or professional sharing flows.

## Health Disclaimer

Glix is not a medical device and does not provide diagnosis, treatment or clinical advice. Users should consult qualified healthcare professionals for medical decisions.
