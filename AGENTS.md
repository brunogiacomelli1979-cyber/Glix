# AGENTS.md - Glix

Guidance for future Codex sessions working on Glix.

## Project Summary

Glix is a mobile-first PWA/micro-SaaS for personal glucose logging. It is a digital diary for organizing glucose measurements, trends and history. It must not be presented or evolved as a medical diagnosis, treatment or recommendation tool.

## Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Supabase Auth
- Supabase Database with Row Level Security
- Vercel deployment
- PWA manifest and public icons

Before changing framework-specific code, remember this project uses a modern Next.js version. Check current project patterns and local files before assuming older API behavior.

## Current Product Areas

- `/registrar`: primary post-login flow for fast glucose registration.
- `/dashboard`: short summary view with key indicators and chart.
- `/historico`: detailed history with filters, editing and deletion.
- Public pages: landing, login and registration.

Preserve the product tone: calm, clear, health-tech, non-alarmist and focused on organization.

## Validation Commands

Use Windows commands:

```bash
npm.cmd run lint
npm.cmd run build
```

Run both after code changes when feasible. Documentation-only changes can still run them when requested.

## Safety Rules

- Never expose or request `service_role` keys.
- Never commit `.env.local` or real secrets.
- Never disable RLS.
- Never weaken Supabase policies without explicit confirmation.
- Do not change authentication, database schema, RLS, SQL migrations or security-sensitive code without asking first.
- Ask for confirmation before any database, authentication or security change.
- Do not use `localStorage`, IndexedDB, service worker cache or offline cache for sensitive glucose data unless the user explicitly approves a privacy-reviewed design.
- Do not add medical AI, diagnosis, treatment guidance, clinical recommendations or alarmist messaging.
- Keep Glix positioned as a personal diary, not a medical device.

## Development Principles

- Prefer small, focused changes.
- Preserve existing architecture and Server Actions unless there is a clear reason to change them.
- Reuse existing components and helpers before creating new abstractions.
- Keep validation centralized in the existing glucose/domain helpers.
- Maintain mobile-first UX and comfortable touch targets.
- Avoid heavy dependencies unless clearly justified.
- Separate features into incremental changes that are easy to review.

## Documentation Expectations

When changing product behavior, update relevant documentation if requested or if the change affects:

- user flow;
- routes;
- security posture;
- PWA behavior;
- roadmap;
- setup instructions.

Keep documentation professional, honest and suitable for portfolio review.

## Commit Style

Use short imperative commit messages, for example:

```text
Add quick glucose registration
Split dashboard and history views
Update documentation for new app navigation
```

Do not create commits unless the user asks for it.
