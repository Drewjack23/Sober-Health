# Store privacy disclosure worksheet

This worksheet reflects the current source code and is a starting point for the forms in App Store Connect and Google Play Console. Re-evaluate it whenever providers, analytics, advertising, or data flows change.

## Current SDK posture

- No advertising SDK or advertising identifier use.
- No behavioral analytics SDK.
- No camera, microphone, location, or contacts access. These Android permissions are explicitly blocked.
- No HealthKit or Health Connect integration.
- No third-party tracking across apps or websites.
- Supabase is the optional production authentication/backend provider.
- Recipe images are loaded from a remote image host.

## Apple privacy nutrition label

When production Supabase is enabled, disclose these as collected and linked to the user for app functionality:

- Contact Info: name and email address.
- Health & Fitness: health and fitness data entered by the user, including recovery, body, activity, nutrition, mood, sleep, and habit information.
- User Content: journal/reflection notes and other free-form entries.
- Identifiers: user ID.

Declare that data is not used for third-party advertising, developer advertising, or tracking. If production logging or crash reporting is later added, update the Diagnostics answers before shipping that build.

## Google Play Data Safety

For the cloud-enabled production build:

- Data collected: personal information, health and fitness information, app activity, and optional user-generated content.
- Purpose: app functionality, account management, personalization, security, and developer communications initiated by the user.
- Data sharing: no sale and no sharing for advertising. Supabase acts as a service provider processing data on the developer's behalf.
- Data is encrypted in transit by HTTPS/TLS.
- Users can request deletion in-app through Settings.
- All wellness fields other than the minimum account fields are optional user inputs.

## Health and recovery review notes

- The app is general wellness software, not a medical device or treatment service.
- It does not recommend medication, diagnose conditions, or instruct unsupervised detox.
- BMI is labeled as screening context.
- Nutrition values are estimates and allergy preferences do not replace label checking.
- Emergency and crisis resources are external and initiated by the user.
- The intended audience is adults age 18 and older.

Have privacy/legal counsel validate the final answers, retention language, service-provider contracts, and launch-country requirements before public release.
