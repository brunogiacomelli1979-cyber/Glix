# Glix

Glix is a mobile-first micro-SaaS/PWA for personal glucose tracking. It helps users quickly register glucose measurements, review a simple summary and access a detailed editable history when needed.

Production: [https://glix-one.vercel.app/](https://glix-one.vercel.app/)  
Repository: [https://github.com/brunogiacomelli1979-cyber/Glix](https://github.com/brunogiacomelli1979-cyber/Glix)

> Glix is a personal tracking diary. It does not provide medical diagnosis, treatment advice or clinical recommendations.

## Status

Current status: portfolio-ready MVP published in production.

The project already includes authentication, a quick logging flow, protected summary and history views, CRUD for glucose records, visual classification, temporal filters, automatic insights, a basic evolution chart, centralized validation, reusable components, a refined mobile-first interface and installable PWA support.

## Product Overview

Many people still track glucose readings using paper notes, spreadsheets or fragmented apps. Glix explores a calmer, clearer and more organized experience for personal glucose logging.

The product focuses on:

- quick glucose measurement registration;
- secure access with user accounts;
- a short summary for daily review;
- organized editable history by period and context;
- simple visual trends without clinical interpretation;
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
- Product-style landing hero built with HTML/CSS, avoiding generic external mockups
- Email/password authentication with Supabase Auth
- Show/hide password control on login and registration pages
- Protected logged-in experience split into three clear areas:
  - `Registrar`: fast daily glucose logging
  - `Resumo`: short dashboard with key indicators
  - `Historico`: detailed history with filters, editing and deletion
- Quick glucose registration after login
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
- Floating `+` shortcut from summary/history to the quick registration screen
- Centralized validation
- Mobile-first responsive UI
- Improved contrast and readability for dashboard cards, filters, chart, history and forms
- Installable PWA with manifest, public icons and mobile installation metadata

## Logged-In User Flow

The private app is organized around the most common real-world task: registering a glucose measurement quickly.

```text
Login -> Registrar -> Resumo -> Historico
```

Main routes:

- `/registrar`: primary post-login route focused on saving a new measurement in seconds.
- `/dashboard`: compact summary view with latest measurement, 7-day average, min/max, trend, insight and mini chart.
- `/historico`: detailed view with full filtered history, notes, editing and deletion.

This separation keeps the daily experience simple while preserving deeper analysis and record management for moments when the user wants to review details.

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

PWA icons are also available in `public/` for browser and mobile installation support.

## Architecture Summary

The app uses the Next.js App Router with server-side data access through Supabase. The dashboard is protected by Supabase session handling and reads only the authenticated user's glucose records.

High-level flow:

```text
User -> Next.js App Router -> Server Actions / Server Components -> Supabase Auth + Database -> Logged-in UI
```

Key architectural decisions:

- Server Actions handle mutations.
- Server Components fetch protected data for `Registrar`, `Resumo` and `Historico`.
- Supabase Auth manages user identity.
- Supabase Row Level Security isolates user data.
- Logged-in UI is split into reusable components.
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
- Supabase trigger/function hardening documented for `public.handle_new_user()`.

See [SECURITY.md](./SECURITY.md) for more details.

## Testing as a PWA

To test the installable experience:

1. Open the production app on a mobile browser:

```text
https://glix-one.vercel.app/
```

2. Use the browser install option:

- Android/Chrome: menu -> Add to Home screen or Install app.
- iOS/Safari: Share -> Add to Home Screen.

3. Open Glix from the home screen and verify:

- the app opens in a standalone mobile view;
- the icon appears correctly;
- the landing page and dashboard remain readable;
- login, filters, chart, history and forms keep the same behavior as the browser version.

Glix does not implement offline caching for private glucose data at this stage. This is intentional to avoid storing sensitive health-related data locally without a clearer privacy strategy.

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
  dashboard/page.tsx       Protected summary page
  dashboard/actions.ts     Server Actions for glucose records
  historico/page.tsx       Protected detailed history
  registrar/page.tsx       Protected quick logging page
  auth/actions.ts          Authentication actions

src/components/app/        Logged-in navigation and shortcuts
src/components/dashboard/  Dashboard components
src/components/measurements/ Quick measurement form components
src/components/ui/         Base UI components
src/lib/glucose.ts         Glucose rules, metrics and validation
src/types/glucose.ts       Shared glucose types
src/utils/supabase/        Supabase clients and session helpers
public/branding/           Official visual assets
```

## Roadmap

Short-term:

- test the experience with real users;
- add profile/account page;
- add password recovery flow;
- add dedicated LGPD consent page/flow;
- create a QA checklist for mobile/PWA testing;
- add production monitoring and error tracking;
- connect a custom domain.

Medium-term:

- export CSV reports;
- export PDF reports as a future premium feature;
- profile settings;
- account deletion flow;
- production analytics and monitoring.
- Supabase Pro evaluation if the product advances beyond MVP/testing.

Future premium ideas:

- advanced reports;
- PDF export;
- longer history and exports;
- reminders;
- integrations with automation tools;
- optional caregiver or professional sharing flows.

## Health Disclaimer

Glix is not a medical device and does not provide diagnosis, treatment or clinical advice. Users should consult qualified healthcare professionals for medical decisions.
