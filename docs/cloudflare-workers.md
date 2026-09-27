# Deploy the Astro portfolio to Cloudflare Workers

Target: `ajc-portfolio-v2`, account `9bfc6bfa08167077ab3254959168b173`.
Source branch: `redesign/personal-brand`.

The repository's `wrangler.jsonc` uploads Astro's static `dist` output. No Next.js build or server-side Astro adapter is needed. Domain assignments remain managed in the Cloudflare dashboard; confirm `v2.ashwinchempolil.me` under this Worker's Settings → Domains & Routes.

## Deploy from your terminal

Ensure you are on `redesign/personal-brand`. Configure your actual public PostHog token and regional ingestion host in `.env.local`:

```dotenv
PUBLIC_POSTHOG_KEY=phc_REPLACE_WITH_YOUR_PROJECT_TOKEN
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

EU projects use `https://eu.i.posthog.com`. Do not commit `.env.local`.

Run with Node.js 22.12 or newer:

```sh
npm ci
npx --yes wrangler@4 login
npx --yes wrangler@4 deploy
```

Wrangler runs `npm run build` before uploading. This deploys the current local source to the existing Worker; it does not push Git commits. A build failure stops the deployment. Check the site and PostHog's live events after a successful deployment.

## Enable automatic deployment from GitHub

Open the existing Worker → Settings → Build. Connect the repository if needed and configure:

| Setting | Value |
| --- | --- |
| Repository | `ashwinjohn3/ajc-portfolio` |
| Production branch | `redesign/personal-brand` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx --yes wrangler@4 deploy` |

Under **Build variables and secrets**, set `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, and `NODE_VERSION=22.23.2`. Runtime variables alone cannot configure analytics in this static site. Workers Builds uses its configured build command rather than Wrangler's local custom build command.

Commit `wrangler.jsonc` and this guide, then push the branch. Check the Worker's Builds history for the new commit and any failure logs, then its Deployments history after a successful production deployment. A failed build or a preview build does not necessarily update the production deployment.

The GitHub Pages workflows are separate from Workers Builds and do not deploy this Worker.

References:
- https://developers.cloudflare.com/workers/static-assets/get-started/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
