# Security - Glix

Glix handles personal glucose records, so security and privacy are important even though the project is an MVP.

This document describes the current security model and future improvements.

## Scope

Glix is a personal tracking diary. It does not provide medical diagnosis, treatment or clinical recommendations.

Users own their data. The app is designed to help users organize personal records, not to replace professional medical guidance.

## Authentication

Authentication is handled by Supabase Auth.

Current flow:

- email/password sign up;
- email confirmation depending on Supabase project settings;
- login through Supabase Auth;
- protected dashboard route;
- logout through a Server Action.

Private pages should only be available to authenticated users.

## Supabase Auth

Supabase Auth manages:

- user identity;
- session cookies;
- authentication state;
- password handling.

The application does not implement custom password storage.

## Row Level Security

Supabase Row Level Security is enabled for the main tables.

RLS policies ensure users can only access their own records.

For `glucose_records`, policies cover:

- select own records;
- insert records for own user id;
- update own records;
- delete own records.

For `profiles`, policies cover:

- read own profile;
- update own profile.

RLS is the final enforcement layer. UI checks and query filters improve UX and clarity, but the database policies are the critical security boundary.

## API Keys and Environment Variables

The frontend uses the Supabase anon/publishable key.

This key is expected to be public in a Supabase client-side architecture, but it must be used together with RLS.

Rules:

- do not expose a Supabase service role key in frontend code;
- do not commit `.env.local`;
- do not paste real secrets into documentation;
- use Vercel environment variables for production.

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Server Actions

Glucose record mutations are handled with Next.js Server Actions.

Current protections:

- read authenticated user before mutation;
- redirect unauthenticated users to login;
- validate input before writing;
- filter update/delete operations by `user_id`;
- revalidate dashboard after mutations.

## Input Validation

Validation is centralized in `src/lib/glucose.ts`.

Current validation rules:

- glucose value must be between 20 and 600 mg/dL;
- context must be one of the known measurement contexts;
- notes are limited to 300 characters;
- invalid dates are rejected;
- empty required submissions are rejected.

Validation improves data quality and user experience, but it does not replace database-level security.

## Privacy

Glix stores personal glucose records connected to user accounts.

Current privacy principles:

- each user should only access their own data;
- records are not publicly exposed;
- no service role key is used in the frontend;
- no diagnosis or treatment recommendation is generated.

## LGPD Considerations

For a production-grade health-related product in Brazil, LGPD requirements should be reviewed carefully.

Future considerations:

- privacy policy;
- terms of use;
- account deletion flow;
- data export;
- data retention policy;
- explicit consent language;
- audit of third-party processors;
- incident response process.

## Current Limitations

The MVP does not yet include:

- full privacy policy page;
- automated security tests;
- account deletion;
- user data export;
- audit logs;
- rate limiting strategy;
- production monitoring;
- formal threat model.

## Recommended Next Steps

- Add privacy policy and terms pages.
- Add account deletion workflow.
- Add CSV/PDF export with clear user consent.
- Generate typed Supabase database types.
- Add tests for validation rules.
- Add monitoring and error tracking.
- Review Supabase policies before scaling to real users.

## Health Disclaimer

Glix is not a medical device. It does not diagnose, treat, prevent or cure medical conditions. Users should consult qualified healthcare professionals before making health decisions.
