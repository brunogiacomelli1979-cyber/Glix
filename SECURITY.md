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

## Supabase Function Hardening

Glix uses a trigger function named `public.handle_new_user()` to create a row in `public.profiles` whenever Supabase Auth creates a new user in `auth.users`.

The Supabase Security Advisor reported warnings for this function:

- `function_search_path_mutable`
- `anon_security_definer_function_executable`
- `authenticated_security_definer_function_executable`

These were addressed manually in the Supabase SQL Editor and reflected in `SUPABASE_SETUP.md`.

Current hardening:

- the function remains `SECURITY DEFINER`, because it needs to insert a profile row as part of the internal auth trigger flow;
- the function explicitly sets `search_path = public, auth`;
- direct execute permission is revoked from `PUBLIC`;
- direct execute permission is revoked from `anon`;
- direct execute permission is revoked from `authenticated`;
- the `on_auth_user_created` trigger is recreated after dropping any previous version.

### Why Fixed `search_path` Matters

PostgreSQL functions can resolve unqualified object names using the active `search_path`. If a `SECURITY DEFINER` function has a mutable or unsafe search path, object resolution can become ambiguous.

By setting:

```sql
SET search_path = public, auth
```

the function executes with a predictable schema resolution order. This reduces the risk of unexpected objects being resolved during function execution.

### Why Revoking `EXECUTE` Matters

The function is intended to be invoked by the internal trigger attached to `auth.users`, not directly by client roles.

Revoking direct execution from `PUBLIC`, `anon` and `authenticated` reduces the callable surface area:

```sql
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
```

The trigger can still execute the function as part of the controlled user creation flow.

### Trigger Role

The trigger `on_auth_user_created` is responsible for calling `public.handle_new_user()` after a new row is inserted into `auth.users`.

This keeps profile creation automatic while avoiding direct client-side access to the function.

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

Supabase Auth also reports `Leaked Password Protection Disabled`. The feature "Prevent use of leaked passwords / HaveIBeenPwned.org" is available on Supabase Pro plans. Glix is currently an MVP/test project on the Free plan, so this remains a documented limitation rather than an active configuration issue.

## Recommended Next Steps

- Add privacy policy and terms pages.
- Add account deletion workflow.
- Add CSV/PDF export with clear user consent.
- Generate typed Supabase database types.
- Add tests for validation rules.
- Add monitoring and error tracking.
- Review Supabase policies before scaling to real users.
- Enable leaked password protection when migrating to a Supabase Pro plan.

## Health Disclaimer

Glix is not a medical device. It does not diagnose, treat, prevent or cure medical conditions. Users should consult qualified healthcare professionals before making health decisions.
