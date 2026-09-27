/* Shared by the Astro and Next.js sites. Uses PostHog's async CDN queue protocol. */
(function () {
  const config = document.currentScript?.dataset;
  if (!config?.key || config.enabled !== 'true' || window.__portfolioAnalytics) return;
  const hosts = {
    'https://us.i.posthog.com': 'https://us-assets.i.posthog.com',
    'https://eu.i.posthog.com': 'https://eu-assets.i.posthog.com',
  };
  const host = config.host || 'https://us.i.posthog.com';
  if (!hosts[host]) return;
  window.__portfolioAnalytics = true;

  // Queue interactions while the SDK loads; blocked analytics never blocks navigation.
  const posthog = window.posthog = window.posthog || [];
  if (!posthog.__SV) {
    posthog.__SV = 1;
    posthog._i = [];
    posthog.people = [];
    posthog.toString = () => 'posthog (stub)';
    posthog.people.toString = () => 'posthog.people (stub)';
    for (const method of ['capture', 'register']) {
      posthog[method] = (...args) => posthog.push([method, ...args]);
    }
    posthog.init = (key, options) => posthog._i.push([key, options, 'posthog']);
  }

  posthog.init(config.key, {
    api_host: host,
    defaults: '2026-01-30',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    // Explicit events avoid collecting arbitrary DOM text, email addresses, or inputs.
    autocapture: false,
    capture_dead_clicks: false,
    rageclick: false,
    disable_surveys: true,
    person_profiles: 'always',
    respect_dnt: true,
    loaded: (client) => client.register({ site_branch: config.branch }),
    before_send: (event) => {
      if (event) event.properties.site_branch = config.branch;
      return event;
    },
  });

  const sdk = document.createElement('script');
  sdk.async = true;
  sdk.crossOrigin = 'anonymous';
  sdk.src = hosts[host] + '/static/array.js';
  document.head.appendChild(sdk);

  function capture(name, properties) {
    window.posthog.capture(name, {
      ...properties,
      site_branch: config.branch,
      page_path: location.pathname,
    });
  }

  function trackLink(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if (url.protocol === 'mailto:') {
      capture('contact_clicked', { contact_method: 'email' });
      return;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
    // Strip destination queries and fragments (which can contain personal information).
    const properties = { destination: url.origin + url.pathname };
    if (/\.pdf$/i.test(url.pathname)) {
      capture('resume_clicked', { ...properties, action: anchor.hasAttribute('download') ? 'download' : 'open' });
    } else if (url.origin !== location.origin) {
      capture('outbound_link_clicked', { ...properties, destination_host: url.hostname });
    } else {
      capture('navigation_clicked', properties);
    }
  }
  document.addEventListener('click', trackLink);
  document.addEventListener('auxclick', trackLink);
  document.addEventListener('portfolio:theme-changed', (event) => {
    capture('theme_changed', { theme: event.detail.theme });
  });
})();
