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

### PWA Preparation

- Added manifest route.
- Added app icon reference.
- Added theme and background colors.
- Added initial screenshots to manifest.
- Prepared mobile installation metadata.

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

## Next Planned Milestones

- Add automated tests for validation helpers.
- Improve PWA install experience.
- Add privacy policy and terms pages.
- Add CSV/PDF export.
- Add account deletion flow.
- Improve accessibility testing.
- Add production monitoring.
