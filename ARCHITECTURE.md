# Architecture - Glix

This document describes the current architecture of Glix, a mobile-first micro-SaaS/PWA for personal glucose tracking.

## Overview

Glix is built with a modern full-stack architecture based on Next.js and Supabase.

High-level flow:

```text
Browser / PWA
  -> Next.js App Router
  -> Server Components and Server Actions
  -> Supabase Auth and Supabase Database
  -> Row Level Security
```

The application is intentionally small, but organized so the MVP can evolve without becoming difficult to maintain.

## Frontend

The frontend uses:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style primitives
- reusable dashboard components
- mobile-first layouts

Main routes:

```text
/              Public landing page
/login         Login page
/register      Registration page
/dashboard     Protected authenticated dashboard
```

The UI follows a health tech visual direction:

- calm navy and aqua palette;
- white cards;
- subtle shadows;
- soft borders;
- mobile-first spacing;
- discreet feedback messages.

## Backend

Supabase is used as backend-as-a-service.

Backend responsibilities:

- user authentication;
- session handling;
- glucose record persistence;
- Row Level Security;
- user-specific access control.

The app does not use a custom API server. Mutations are handled through Next.js Server Actions and Supabase client helpers.

## Authentication

Authentication is handled by Supabase Auth.

Current auth flow:

1. User signs up or logs in with email/password.
2. Supabase manages the session.
3. Next.js middleware/proxy protects private routes.
4. Authenticated users access `/dashboard`.
5. Logged-out users are redirected to `/login`.

The auth flow should remain small and predictable for the MVP.

## Supabase Database

Main tables:

- `profiles`
- `glucose_records`

The `glucose_records` table stores:

- `id`
- `user_id`
- `value_mgdl`
- `context`
- `notes`
- `recorded_at`
- `created_at`

The database structure is documented in `SUPABASE_SETUP.md`.

## Row Level Security

RLS is a central part of the architecture.

Policies ensure that users can only:

- read their own profile;
- update their own profile;
- read their own glucose records;
- insert records for their own user id;
- update their own records;
- delete their own records.

The frontend also filters mutations by `user_id`, but the database remains the final enforcement layer.

## Data Flow

Dashboard data flow:

```text
Dashboard page
  -> create Supabase server client
  -> read authenticated user
  -> query glucose_records
  -> apply period/context filters
  -> calculate metrics and insights
  -> render reusable dashboard components
```

Mutation flow:

```text
Form submission
  -> Server Action
  -> validate form data
  -> read authenticated user
  -> write to Supabase
  -> revalidate dashboard
  -> redirect with user feedback
```

## Code Organization

Important folders:

```text
src/app/
  App Router pages and Server Actions

src/components/dashboard/
  Reusable dashboard components:
  - DashboardHeader
  - FilterBar
  - SummaryCards
  - InsightCards
  - GlucoseChart
  - MeasurementForm
  - HistoryList
  - StatusBadge
  - SubmitButton

src/components/ui/
  Base UI primitives

src/lib/
  Product rules, validation and metric helpers

src/types/
  Shared TypeScript types

src/utils/supabase/
  Supabase client helpers
```

## Validation Layer

Validation is centralized in `src/lib/glucose.ts`.

Current rules:

- glucose value must be between 20 and 600 mg/dL;
- context must be one of the allowed values;
- notes are limited to 300 characters;
- invalid dates are rejected;
- empty required fields are rejected.

This keeps form handling consistent between create and update flows.

## Deployment

Production deploy:

[https://glix-one.vercel.app/](https://glix-one.vercel.app/)

Deployment platform:

- Vercel

Version control:

- GitHub

The app uses public Supabase environment variables. Private service role keys must not be exposed in the frontend or committed to the repository.

## Scalability Considerations

The current architecture is suitable for an MVP and early portfolio version.

Future scalability improvements may include:

- database indexes for larger history queries;
- pagination or infinite loading for records;
- typed Supabase generated database types;
- automated tests for Server Actions and validation;
- observability and error tracking;
- API boundaries if external integrations become necessary;
- improved PWA offline caching strategy;
- separate reporting module.

## Technical Improvements To Consider

- Add unit tests for `src/lib/glucose.ts`.
- Generate Supabase TypeScript types from the database schema.
- Add integration tests for authentication and record flows.
- Add production monitoring.
- Add privacy policy and account deletion flow.
- Improve accessibility testing with keyboard and screen reader checks.
