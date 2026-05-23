# Roadmap - Glix

This roadmap describes the current state of Glix and possible next steps. It is intentionally practical and focused on evolving the MVP without overengineering.

## MVP Completed

The current MVP includes:

- public landing page;
- official visual identity;
- responsive mobile-first UI;
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
- glucose classification badges;
- automatic insights;
- evolution chart;
- centralized validation;
- reusable dashboard components;
- initial PWA manifest;
- Vercel deploy;
- GitHub version control.

## Short-Term Improvements

Priorities for the next iteration:

- improve PWA install experience;
- add better mobile screenshots and icons;
- polish loading and empty states;
- improve form feedback messages;
- add privacy policy page;
- add terms/disclaimer page;
- test the experience on real mobile devices;
- add basic automated tests for validation helpers.

## Medium-Term Improvements

Product and technical improvements:

- CSV export;
- PDF report generation;
- profile settings;
- account deletion flow;
- improved chart interactions;
- pagination or infinite loading for history;
- generated Supabase TypeScript types;
- accessibility audit;
- deployment monitoring and error tracking.

## Future Premium Features

Possible freemium/premium direction:

- advanced reports;
- full historical exports;
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
