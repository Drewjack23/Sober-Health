# Sober Plus Health

Sober Plus Health is a cross-platform wellness app that brings fitness, nutrition, weight context, recovery, mental wellness, habits, and personal progress into one calm experience. Its central product principle is simple: **your health is bigger than a number, and progress does not have to be perfect.**

This repository contains a production-oriented MVP for iOS, Android, tablets, and web. It includes realistic demo data, local persistence, a Supabase-ready backend boundary, and privacy-aware database policies.

## What is implemented

- Premium splash/welcome experience and original app artwork
- Email/password sign-up, sign-in, and password reset integration boundary
- Ten-step, one-question-at-a-time onboarding with adult-only validation
- Personalized responsive dashboard and configurable cards
- Imperial/metric weight logging, BMI screening context, and trends
- Diverse meal catalog, search, filters, swaps, favorites, dislikes, logs, diet matching, and allergy exclusion
- Adaptive workout suggestions, duration/equipment filters, completion, weekly goal, and history
- Optional Recovery tab, dynamic sober time, supportive monthly calendar, check-ins, streaks, and lapse-safe history
- “I need support right now” breathing, coping plan, timer, 988, SAMHSA, and emergency resources
- Mood/stress check-ins, gratitude, breathing timer, and non-causal trend observations
- Progress ranges, weight/BMI/workout/mood charts, non-scale victories, and private achievements
- Light/dark/system themes, notification privacy, dashboard customization, data export, account deletion, and logout
- AsyncStorage-backed development/demo mode and strict TypeScript business logic tests

Sober Plus Health is a wellness and tracking tool, not medical care, diagnosis, detox guidance, nutrition therapy, or emergency treatment.

## Technology

- React Native + Expo SDK 57
- TypeScript with strict mode
- Expo Router
- React Native Web
- Supabase Auth/Postgres/Row Level Security integration
- AsyncStorage for local MVP/demo persistence
- Expo Secure Store included for future sensitive device-token/PIN storage
- `react-native-svg` charts and Expo Linear Gradient
- Zod validation
- Vitest business-logic tests

## Architecture

```text
app/                       Expo Router screens
  (tabs)/                  Home, Fitness, Nutrition, Recovery, Progress
  onboarding/              Ten steps and personalized result
components/                Accessible reusable UI and visualizations
constants/                 Brand and design tokens
data/                      Meal/workout catalog and realistic demo seed
hooks/                     Theme hooks
services/                  Supabase client and auth boundary
state/                     Typed persisted application state
types/                     Domain models
utils/                     BMI, unit, date, meal, and streak logic
tests/                     Business-logic tests
supabase/migrations/       Typed relational schema and RLS policies
supabase/functions/        Authenticated account-deletion function
assets/                    App icon and splash artwork
```

The current MVP uses one persisted application state so it works immediately without credentials. `services/supabase.ts` isolates cloud auth, while `supabase/migrations/001_initial_schema.sql` defines the production data model. The next backend phase should replace state mutations with repositories that sync each domain table and retain offline-first optimistic state.

## Setup

Requirements:

- Node.js 20 LTS or newer (an Expo-supported LTS release is recommended)
- npm
- Xcode for iOS Simulator builds on macOS
- Android Studio for Android Emulator builds

```bash
npm install
cp .env.example .env.local
npm run start
```

Environment variables are optional for Demo Mode:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key
```

Never place the Supabase service-role key in the app. It belongs only in server-side Supabase Edge Function secrets.

## Run each platform

```bash
npm run ios       # starts Expo and opens iOS Simulator
npm run android   # starts Expo and opens Android Emulator
npm run web       # starts the responsive web app
```

You can also scan Expo’s QR code with a compatible Expo Go client when the installed SDK is supported. Native capabilities such as production biometric locking will require a development build.

## Demo Mode

Choose **Explore with demo data** on the welcome screen or **Use demo account** on sign-in. The demo profile is visibly labeled in its profile record (`demoMode: true`) and includes several weeks of weight, workout, meals, water, mood, recovery check-ins, habits, and achievements.

Demo data persists locally under `sober-plus-health:v2`. Use **Delete account and data** in Settings to clear it. Production data is not mixed into the static seed.

## Supabase setup

1. Create a Supabase project.
2. Apply [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) with the Supabase CLI or SQL editor.
3. Enable email/password authentication and configure confirmation/reset redirect URLs for `soberplushealth://` plus the deployed web origin.
4. Add the public project URL and anonymous key to `.env.local`.
5. Deploy the deletion function:

   ```bash
   supabase functions deploy delete-account
   ```

6. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as Edge Function secrets; never expose them with an `EXPO_PUBLIC_` prefix.

Every user-owned table has Row Level Security enabled with `auth.uid()` ownership policies. Catalog tables only expose safe read policies. Account deletion is performed server-side after validating the caller’s bearer token.

Before production, add schema-generated TypeScript types and repositories for server sync, offline reconciliation, pagination, audit logs, and encrypted handling of trusted contact details.

## Quality checks

```bash
npm run typecheck
npm test
npm run lint
npm run build:web
```

Native release checks and EAS commands:

```bash
npm run doctor
npm run bundle:ios
npm run bundle:android
npm run eas:build:ios
npm run eas:build:android
```

The native application identifiers and version counters are configured in `app.json`, and production EAS profiles are defined in `eas.json`. See [`docs/STORE_RELEASE.md`](docs/STORE_RELEASE.md) for the complete TestFlight, Play internal-testing, metadata, privacy, and submission runbook. Store listing drafts are under `store/metadata/en-US`.

Public web routes are included for `/privacy-policy`, `/terms`, and `/app-support`. Deploy the web build to a permanent HTTPS domain and use those URLs in App Store Connect and Google Play Console. Set the real support email and public site URL through the production environment rather than committing secrets.

The test suite covers adult BMI boundaries, imperial/metric conversion, weight trends, recovery streak/lapse/calendar logic, allergy exclusion, diet filtering, dislikes, and recommendation ranking.

## Privacy and health safety

- Recovery and body information is never public by default.
- Sensitive notification text and milestone notifications are independently controlled.
- App PIN/biometric lock is explicitly marked as a pre-beta capability; production implementation should keep only device-scoped secrets in Secure Store.
- Lapses do not delete prior recovery history or earned milestones.
- BMI is presented only as adult screening context and never as a diagnosis.
- Recorded allergens are removed before recommendations are ranked.
- The app does not prescribe extreme restriction, medication, or unsupervised detox.
- The support flow includes 988, FindTreatment.gov/SAMHSA, and 911. U.S.-specific resources must be localized before international release.

## Production and store preparation

Before a public beta or App Store/Google Play submission:

- Complete cloud repositories, migration testing, email verification, session recovery, rate limiting, and abuse controls.
- Add Apple/Google authentication with account-linking safeguards.
- Implement audited native biometric/PIN locking and encrypted trusted-contact storage.
- Add a consented privacy policy, terms, data-retention policy, support URL, and in-app account-deletion validation.
- Complete accessibility audits with VoiceOver/TalkBack, dynamic type, reduced motion, keyboard navigation, and color-contrast tooling.
- Test on small iPhone, current iPhone, large Android, iPad/tablet, and desktop browsers.
- Add device E2E flows for auth, onboarding, log entry, recovery check-in, offline state, and deletion.
- Add Sentry/observability with strict health-data redaction and no sensitive analytics payloads.
- Configure EAS project IDs, signing certificates, bundle IDs, app icons, privacy manifests, Android data safety, Apple privacy nutrition labels, screenshots, review notes, and age rating.
- Have clinical/legal/privacy specialists review safety language, crisis resources, nutrition boundaries, and applicable health/privacy obligations.
- Add HealthKit/Health Connect only behind explicit, granular consent and least-privilege scopes.

Future integrations already have clear domain boundaries for HealthKit/Health Connect, wearables, steps, push notifications, barcode scanning, food photos, AI planning, community/support, accountability partners, meetings, and subscriptions.
