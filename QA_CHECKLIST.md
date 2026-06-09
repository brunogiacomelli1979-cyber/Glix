# QA Checklist - Glix

Manual checklist for validating Glix after relevant product, UX, security or code changes.

Glix is a personal glucose tracking diary. It does not provide medical diagnosis, treatment advice or clinical recommendations.

## 1. Local Environment

- [ ] Install dependencies if needed with `npm install`.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run dev`.
- [ ] Open `http://127.0.0.1:3000`.
- [ ] Confirm the app loads without console/runtime errors.

## 2. Authentication

- [ ] Create a new account.
- [ ] Confirm the email flow works when required by Supabase settings.
- [ ] Log in with a valid account.
- [ ] Log out successfully.
- [ ] Confirm session persistence after refreshing the browser.
- [ ] Confirm a logged-out user cannot access `/registrar`, `/dashboard` or `/historico`.
- [ ] Confirm a logged-in user can access `/registrar`, `/dashboard` and `/historico`.

## 3. Glucose Registration

- [ ] Create a valid glucose measurement from `/registrar`.
- [ ] Confirm glucose value is required.
- [ ] Confirm values below the minimum are rejected.
- [ ] Confirm values above the maximum are rejected.
- [ ] Confirm context is required.
- [ ] Confirm date/time is filled automatically.
- [ ] Confirm date/time can be manually changed.
- [ ] Confirm observation is optional.
- [ ] Confirm success and error messages are understandable.
- [ ] Confirm the new record appears in `/historico`.

## 4. Summary Dashboard

- [ ] Confirm `/dashboard` loads for a logged-in user.
- [ ] Confirm the latest measurement appears correctly.
- [ ] Confirm the 7-day average is displayed.
- [ ] Confirm the lowest value is displayed.
- [ ] Confirm the highest value is displayed.
- [ ] Confirm the trend text appears.
- [ ] Confirm the chart renders with recent data.
- [ ] Confirm the discreet insight appears without alarmist language.
- [ ] Confirm the floating `+` button opens `/registrar`.

## 5. History

- [ ] Confirm `/historico` loads for a logged-in user.
- [ ] Confirm the complete filtered list appears.
- [ ] Confirm period filters work.
- [ ] Confirm context filters work.
- [ ] Edit a record and confirm the change is saved.
- [ ] Delete a record and confirm it is removed.
- [ ] Confirm observations appear when present.
- [ ] Confirm edit/delete actions keep or return the user to `/historico`.
- [ ] Confirm the floating `+` button opens `/registrar`.

## 6. Security and Privacy

- [ ] Confirm one user cannot see another user's records.
- [ ] Confirm RLS remains enabled in Supabase.
- [ ] Confirm `service_role` is not exposed in frontend code or public files.
- [ ] Confirm `.env.local` is not staged or committed.
- [ ] Confirm sensitive glucose data is not stored in `localStorage`.
- [ ] Confirm sensitive glucose data is not stored in offline cache.
- [ ] Confirm no feature presents medical diagnosis or treatment guidance.

## 7. PWA and Mobile

- [ ] Install the app on a mobile device or mobile browser.
- [ ] Confirm the app icon appears correctly.
- [ ] Confirm the splash/loading screen matches the Glix identity.
- [ ] Confirm navigation works on mobile.
- [ ] Confirm buttons and touch targets are comfortable.
- [ ] Confirm no important button is cut off.
- [ ] Confirm `/registrar`, `/dashboard` and `/historico` are usable on small screens.

## 8. Production and Vercel

- [ ] Confirm the Vercel deploy completes without errors.
- [ ] Confirm production environment variables are configured.
- [ ] Confirm login works in production.
- [ ] Confirm glucose registration works in production.
- [ ] Confirm `/dashboard` loads in production.
- [ ] Confirm `/historico` loads in production.
- [ ] Confirm no sensitive values appear in logs, UI or public source.

## 9. Approval Before Commit or Push

- [ ] `npm.cmd run lint` passed.
- [ ] `npm.cmd run build` passed.
- [ ] The main flow was tested: login -> registrar -> dashboard -> historico.
- [ ] No sensitive key or environment value was changed.
- [ ] Supabase, RLS and authentication changes were reviewed or avoided.
- [ ] Documentation was updated if the change affected UX, routes, security or product behavior.
- [ ] The change is small enough to review clearly.
