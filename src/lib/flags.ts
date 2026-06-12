// ---------------------------------------------------------------------------
// Feature flag helpers
// Thin typed wrappers over import.meta.env.PUBLIC_* so page/component authors
// never have to spell out the raw env string comparison themselves.
// ---------------------------------------------------------------------------
import type { FeatureFlag } from '../data/site';
import { FEATURE_FLAGS } from '../data/site';

/**
 * Returns true when the named feature flag is enabled.
 *
 * Usage in an Astro page frontmatter:
 *   import { isEnabled } from '../lib/flags';
 *   if (!isEnabled('projects')) return new Response(null, { status: 404 });
 *
 * Usage in a template expression:
 *   {isEnabled('photography') && <a href="/photography">photography</a>}
 */
export function isEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Inverse of isEnabled — returns true when the flag is OFF.
 * Useful for early-return guards at the top of page frontmatter.
 *
 *   if (isDisabled('projects')) return new Response(null, { status: 404 });
 */
export function isDisabled(flag: FeatureFlag): boolean {
  return !FEATURE_FLAGS[flag];
}
