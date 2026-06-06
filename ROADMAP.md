# Roadmap - Glix

This roadmap describes the current state of Glix and possible next steps. It is intentionally practical and focused on evolving the MVP without overengineering.

## MVP Completed

The current MVP includes:

- public landing page;
- landing hero built with HTML/CSS to represent the product interface;
- official visual identity;
- integrated Glix branding across the app;
- responsive mobile-first UI;
- refined dashboard readability and contrast;
- quick glucose registration flow;
- `Registrar` as the primary post-login experience;
- compact summary dashboard;
- separate detailed history view;
- clear logged-in navigation with Registrar, Resumo, Historico and Sair;
- Supabase authentication;
- protected dashboard;
- Supabase database integration;
- Row Level Security policies;
- create, edit and delete glucose records;
- measurement fields:
  - glucose value;
  - date/time;
  - context;
  - notes;
- temporal filters:
  - today;
  - 7 days;
  - 30 days;
  - 90 days;
- context filter;
- full history area with filtering, editing and deletion;
- glucose classification badges;
- automatic insights;
- evolution chart;
- centralized validation;
- reusable dashboard components;
- installable basic PWA;
- improved PWA manifest;
- public PWA icons;
- Vercel deploy;
- GitHub version control;
- professional project documentation.

## Short-Term Improvements

Priorities for the next iteration:

- test the experience with real users;
- create a profile/account page;
- add password recovery flow;
- add dedicated LGPD consent page/flow;
- create a QA checklist for mobile/PWA testing;
- connect a custom domain;
- add basic analytics;
- add production monitoring and error tracking;
- improve form feedback messages;
- add privacy policy page;
- add terms/disclaimer page;
- test the experience on real mobile devices;
- add basic automated tests for validation helpers.

## Medium-Term Improvements

Product and technical improvements:

- CSV export;
- PDF export as a future premium feature;
- profile settings;
- account deletion flow;
- improved chart interactions;
- pagination or infinite loading for history;
- generated Supabase TypeScript types;
- accessibility audit;
- deployment monitoring and error tracking.
- Supabase Pro evaluation if the product advances beyond MVP/testing;
- leaked password protection when available through a paid Supabase plan.

## Future Premium Features

Possible freemium/premium direction:

- advanced reports;
- full historical exports;
- PDF report export;
- reminders;
- saved filters;
- custom tags;
- richer trend analysis;
- optional sharing with caregivers or professionals;
- report templates.

Premium features must avoid medical diagnosis or treatment recommendations.

## Scalability

Potential scalability work:

- database indexes for `user_id` and `recorded_at`;
- stronger query pagination;
- cached report generation;
- background jobs for future reports;
- rate limiting strategy;
- observability;
- modular reporting area;
- automated CI checks.

## Security

Security roadmap:

- review RLS policies before onboarding real users;
- add privacy policy and consent language;
- add account deletion;
- add data export;
- add audit of environment variables;
- add tests for validation and access rules;
- document incident response basics.

## Future Integrations

Possible future integrations:

- Vercel Analytics or monitoring;
- n8n for report automation;
- email notifications;
- calendar reminders;
- secure PDF generation;
- optional integrations with external health data sources, if legally and technically appropriate.

Any integration involving health-related data should be reviewed carefully for privacy, consent and security.
