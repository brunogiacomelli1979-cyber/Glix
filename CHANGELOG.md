# Changelog - Glix

This changelog summarizes the main project milestones. Dates are approximate and grouped by development phase rather than formal release tags.

## Current MVP

### Documentation and Product Definition

- Created initial product vision.
- Defined MVP scope.
- Documented database structure.
- Added security notes and roadmap.
- Reworked documentation for portfolio presentation.

### Project Setup

- Created the Next.js project.
- Configured TypeScript.
- Added Tailwind CSS.
- Added base UI components.
- Organized initial project structure.

### Supabase Integration

- Added Supabase client helpers.
- Configured Supabase Auth.
- Added session handling for protected routes.
- Created database setup script.
- Added `profiles` and `glucose_records` tables.
- Enabled Row Level Security.
- Added policies for user-owned data access.
- Documented Supabase Security Advisor hardening for `public.handle_new_user()`.
- Added fixed function `search_path` and revoked direct execute permissions in the setup script.

### Authentication

- Implemented registration.
- Implemented login.
- Implemented logout.
- Added protected dashboard routing.
- Added email confirmation guidance for users.

### Glucose Records CRUD

- Added glucose record creation.
- Added record listing for authenticated users.
- Added record editing.
- Added record deletion.
- Preserved user ownership checks in mutations.

### Dashboard

- Added summary cards.
- Added temporal filters.
- Added context filter.
- Added glucose classification badges.
- Added automatic insights.
- Added glucose evolution chart.
- Improved mobile-first dashboard layout.

### Visual Identity

- Created official visual assets in Canva.
- Added Glix logo.
- Added app icon.
- Added landing hero image.
- Added dashboard preview asset.
- Applied health tech visual direction across pages.
- Replaced the landing hero image with a product-style HTML/CSS mockup.
- Improved landing page readability and reduced the generic marketing feel.

### PWA Preparation

- Added manifest route.
- Added app icon reference.
- Added theme and background colors.
- Added initial screenshots to manifest.
- Prepared mobile installation metadata.
- Improved PWA installability.
- Created public PWA icons for browser and mobile installation.
- Added icon metadata for installable mobile usage.

### Deployment

- Deployed the MVP to Vercel.
- Connected project to GitHub repository.
- Validated production-oriented build flow.

### Architecture Refactor

- Extracted reusable dashboard components:
  - DashboardHeader
  - FilterBar
  - SummaryCards
  - InsightCards
  - GlucoseChart
  - MeasurementForm
  - HistoryList
  - StatusBadge
  - SubmitButton
- Added shared glucose types.
- Centralized glucose rules, metrics and validation.
- Improved TypeScript safety.
- Added loading/disabled submit states.

### Validation

- Added centralized validation for:
  - glucose value range;
  - context;
  - notes length;
  - dates;
  - empty submissions.

### UI/UX Refinement

- Improved dashboard legibility for mobile and installed PWA usage.
- Increased touch target comfort in filters, actions and form controls.
- Improved contrast for secondary text in cards, chart, history and helper messages.
- Refined the mobile-first dashboard experience while preserving the existing CRUD flow.

## Next Planned Milestones

- Add automated tests for validation helpers.
- Add privacy policy and terms pages.
- Add CSV/PDF export.
- Add account deletion flow.
- Improve accessibility testing.
- Add production monitoring.
