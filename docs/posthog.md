# PostHog setup

The integration is ready but inactive until a public project token is provided at build time. No PostHog account or dashboard is created by these code changes.

1. Create an account at https://posthog.com and create a project. Choose your project's US or EU region.
2. In the project settings, copy the project token (`phc_...`). This is a browser-visible token, not a personal API key.
3. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, add `POSTHOG_KEY` with the project token and `POSTHOG_HOST` with `https://us.i.posthog.com` or `https://eu.i.posthog.com`.
4. Deploy the desired branch. These are static sites: changing a variable requires a new build. The existing workflows map those variables to the framework-specific names below. The Astro workflow remains manual; this integration does not change which branch deploys to your domain.

Use the same project token for both versions. Filter or break down reports by the `site_branch` property (`main` or `redesign/personal-brand`) and `$host` to distinguish sites.

For another hosting provider or a local production preview, use these build environment variables:

| Branch | Token | API host |
| --- | --- | --- |
| `redesign/personal-brand` (Astro) | `PUBLIC_POSTHOG_KEY` | `PUBLIC_POSTHOG_HOST` |
| `main` (Next.js) | `NEXT_PUBLIC_POSTHOG_KEY` | `NEXT_PUBLIC_POSTHOG_HOST` |

Copy `.env.example` to `.env.local` and fill in the values locally. Development builds do not track and log an error when the public project token is missing; the app still runs. Production previews do track when configured; use a separate test project for those if you want to keep production reports clean. Removing the key and rebuilding disables tracking.

## What you can see

PostHog Web Analytics provides visitors, sessions, pages, referrers, campaign attribution, approximate geography, devices and browsers. Anonymous person profiles group returning visits where browser storage permits it. They do **not** reveal a visitor's name, email, employer, or real-world identity. There is no login or `identify()` call on this portfolio.

| Event | Meaning |
| --- | --- |
| `$pageview`, `$pageleave` | Initial visits and client-side route changes; session/page engagement |
| `navigation_clicked` | Internal links and section anchors |
| `outbound_link_clicked` | External destinations, such as GitHub or LinkedIn |
| `resume_clicked` | PDF open/download intent (`action`); not proof a download completed |
| `contact_clicked` | Email link clicked; not proof an email was sent |
| `theme_changed` | User-selected theme (`dmg`, `pocket`, `p1`, or Next.js `light`/`dark`) |

In Product Analytics, create trends for the named events and a funnel from `$pageview` to `resume_clicked` or `contact_clicked`. Break down `theme_changed` by `theme`. The dashboards are configured in PostHog after creating your account.

The SDK loads asynchronously from PostHog's regional CDN using its snippet queue protocol. Its History API tracking owns pageviews for both Astro ClientRouter and Next.js; no additional manual pageview handler is installed. Branch labels are attached to SDK-generated and custom events. Custom link events omit destination query strings/fragments and never send email addresses or link text. Standard SDK page URL, referrer and campaign collection remains enabled. DOM autocapture and surveys are disabled. In the current Astro checkout, session replay and exception autocapture follow the PostHog project settings; the client does not override them. The previously prepared Next.js patch still disables replay. Browser Do Not Track is respected; blockers and opted-out browsers can result in missing visits.

## Verify after deploying

Open your deployed site, navigate between pages and back, change a theme, open the résumé and click an outbound link. In PostHog's live activity view, check for one pageview per route visit and the expected custom events, each with `site_branch`. A click event and its resulting pageview are distinct events. Confirm both domains independently. No events should appear for an unconfigured build or `npm run dev`.

Run `node --test scripts/analytics.test.mjs` for the offline event/configuration checks. A real project token and deployment are required to verify ingestion, attribution and SDK-generated pageviews end to end.

References: [PostHog JavaScript installation](https://posthog.com/docs/libraries/js), [SDK configuration](https://posthog.com/docs/libraries/js/config).
