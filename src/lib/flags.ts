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
 * STATIC-MODE GATING (output: 'static'): do NOT gate a route with
 * `return new Response(null, { status: 404 })` — in a static build that Response
 * is rendered to a 404-bodied HTML file, so the route still ships. Instead use a
 * dynamic rest route (e.g. `projects/[...path].astro`) whose getStaticPaths()
 * returns [] when the flag is off, so Astro emits zero HTML for it:
 *
 *   import { isEnabled } from '../../lib/flags';
 *   export function getStaticPaths() {
 *     return isEnabled('projects') ? [{ params: { path: undefined } }] : [];
 *   }
 *
 * Usage in a template expression (conditional nav/link rendering):
 *   {isEnabled('photography') && <a href="/photography">photography</a>}
 */
export function isEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Inverse of isEnabled — returns true when the flag is OFF.
 * Useful for conditional rendering. For route suppression in static output,
 * prefer the empty-getStaticPaths pattern documented on isEnabled above rather
 * than an early-return Response (which still emits a static HTML file).
 */
export function isDisabled(flag: FeatureFlag): boolean {
  return !FEATURE_FLAGS[flag];
}
