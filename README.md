# Relay Practice

Marketing site and integration starter for Relay Practice, an AI operations partner for medical, dental, and med spa practices.

## Run locally

```bash
npm install
npm run dev
```

Open **http://relaypractice.za.localhost:3000**. The `.za.localhost` hostname resolves to this machine without purchasing a domain or changing the system hosts file. It is for local development only; it is not a registered or publicly reachable `.za` domain. `http://localhost:3000` also works.

## Pages

- Home, How it works, ROI calculator, Case studies, Pricing, Apply, Dashboard, and Blog.
- Dashboard and case-study figures are explicitly illustrative sample data.
- Pricing is `$10,000` per practice per month. The target model is 50 practices / `$500,000` monthly recurring revenue.

## Deploy on Render

The included `render.yaml` configures a Render Free web service. In Render, create a new Blueprint and connect this repository; Render will build with `npm ci && npm run build` and start the Next.js server with `npm run start`. No custom `app.cjs` entry point is needed: Next.js serves the app and listens on Render's assigned port.

The Free plan has service limits and may spin down when idle, so the first request after inactivity can be delayed. Review Render's current plan limits before deploying. Add environment variables in the Render service settings only for integrations you enable; do not commit secrets.

## Optional integrations

Copy `.env.example` to `.env.local` and provide values only when enabling that integration:

- Supabase: create the tables using `supabase/schema.sql`; configure `NEXT_PUBLIC_SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY`. The application form stores practice contact details. RLS is enabled and access is restricted to the service role.
- Twilio: configure the account SID, auth token, and sending number. `POST /api/sms` requires `Authorization: Bearer <INTERNAL_API_KEY>` and JSON `{ "to": "+15551234567", "message": "..." }`. Store the internal key only on trusted server-side callers. The route sends an SMS; it does not implement voice agents or practice-management scheduling.
- PayPal: configure the client ID, client secret, and an approved subscription plan ID. Checkout remains unavailable when these values are missing. Set `PAYPAL_ENVIRONMENT=live` only after testing in sandbox.
- Brevo: apply `supabase/schema.sql`, create one contact list, create the contact attributes `COUNTRY` and `PRACTICE_TYPE` if they do not already exist, then set `BREVO_API_KEY` and `BREVO_LIST_ID` in `.env.local`. The blog signup requires an unchecked-by-default consent checkbox and stores consent time and market before syncing the contact server-side. It does not send campaigns; compose/send those from Brevo so its campaign unsubscribe handling is used. Test with your own consenting address before promoting the form. Never add patient lists.
- Request firewall: apply `supabase/schema.sql`, set `RATE_LIMIT_HASH_SECRET` to a random secret of at least 32 characters, and deploy behind a trusted proxy that supplies `cf-connecting-ip`, `x-real-ip`, or a trustworthy final `x-forwarded-for` entry. The shared database limiter fails closed if it cannot identify the client or reach Supabase.

The app firewall adds a nonce-based Content Security Policy, anti-framing and browser security headers, same-origin checks for browser APIs, POST/JSON-only API policies, an 8 KB declared-body limit, and shared rate limits (5 applications/hour, 15 PayPal verifications/minute, 60 authenticated SMS requests/minute per client IP). For network-layer protection, put the deployment behind a managed WAF such as Cloudflare, enable managed OWASP rules and DDoS protection, configure WAF rate limits, and prevent direct access to the origin. Next.js application middleware is not a substitute for a perimeter firewall.

The $10,000/month premium includes the cybersecurity agent suite and firewall policy monitoring. The site states 50 years of cybersecurity experience as supplied; replace that claim if it does not reflect verifiable team experience. Agents can triage and recommend; firewall deployment and rule changes require environment access and human approval.

The agent workflows shown on the website are product scope and UI, not a production autonomous medical-practice system. Live voice, appointment/eligibility/claims integrations require the practice's telephony and practice-management APIs, operational rules, consent processes, and deployment credentials. Do not send patient health information through the public application form, SMS demo endpoint, or analytics metadata.