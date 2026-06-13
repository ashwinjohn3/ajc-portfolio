/**
 * tints.ts — SINGLE SOURCE OF TRUTH for the analog-display tint registry.
 *
 * Before this module the cycle order + per-tint bg + dark-set were duplicated
 * across three hand-synchronized places (BaseLayout's no-flash script,
 * ThemeToggle's cycler, and the CSS), so adding/renaming a tint meant editing
 * all three in lockstep or the no-flash fallback silently desynced.
 *
 * Now: BaseLayout and ThemeToggle both `define:vars`-inject derived literals
 * from THIS array into their `is:inline` scripts at BUILD time (no runtime
 * import — the no-flash script stays literal-fast and pre-paint).
 *
 * CROSS-REFERENCE: the `bg` values below MUST match `--brand-bg` for each
 * `[data-theme]` block in `src/styles/global.css` (DMG = `:root`). global.css
 * remains the CSS token authority; this registry only mirrors the bg + the
 * color-scheme used by the no-flash paint fallback. `assertTintsSyncedWithCss`
 * (below) lets a build step cheaply assert the two never drift.
 */

export type TintId = 'dmg' | 'pocket' | 'amber' | 'p1' | 'paper' | 'vfd';

export interface Tint {
  /** Stable id, also the [data-theme] attribute value (dmg = :root, no attr). */
  id: TintId;
  /** Decorative emoji evoking the display hardware (aria-hidden in the UI). */
  emoji: string;
  /** Human-readable name surfaced in the toggle's aria-label. */
  label: string;
  /** Panel background — MUST equal --brand-bg for this tint in global.css. */
  bg: string;
  /** color-scheme for the pre-paint fallback so dark tints never flash white. */
  scheme: 'light' | 'dark';
}

/**
 * Ordered registry. Array order === click-cycle order
 * (dmg → pocket → amber → p1 → paper → vfd → dmg). DMG is first/default and
 * renders with NO [data-theme] attribute (it lives in :root).
 */
export const TINTS: readonly Tint[] = [
  { id: 'dmg',    emoji: '🎮',  label: 'dmg',    bg: '#9bbc0f', scheme: 'light' },
  { id: 'pocket', emoji: '🕹️', label: 'pocket', bg: '#c6cbb6', scheme: 'light' },
  { id: 'amber',  emoji: '🟠',  label: 'amber',  bg: '#1a1206', scheme: 'dark'  },
  { id: 'p1',     emoji: '🟢',  label: 'p1',     bg: '#0a160a', scheme: 'dark'  },
  { id: 'paper',  emoji: '📄',  label: 'paper',  bg: '#d7dde0', scheme: 'light' },
  { id: 'vfd',    emoji: '🔵',  label: 'vfd',    bg: '#04110f', scheme: 'dark'  },
] as const;

/** Cycle order ids — derived, consumed by the no-flash + cycler scripts. */
export const TINT_IDS: readonly TintId[] = TINTS.map((t) => t.id);

/** id → bg map for the pre-paint background fallback. */
export const TINT_BG: Record<TintId, string> = Object.fromEntries(
  TINTS.map((t) => [t.id, t.bg])
) as Record<TintId, string>;

/** ids whose scheme is 'dark' (paint fallback sets colorScheme = 'dark'). */
export const TINT_DARK: TintId[] = TINTS.filter((t) => t.scheme === 'dark').map(
  (t) => t.id
);

/** id → emoji map for the toggle label. */
export const TINT_EMOJI: Record<TintId, string> = Object.fromEntries(
  TINTS.map((t) => [t.id, t.emoji])
) as Record<TintId, string>;

/**
 * Cheap build-time guard: assert the registry's bg values match the
 * `--brand-bg` declarations parsed out of global.css, AND that each tint's
 * declared `scheme` agrees with that CSS bg. Throws (failing the build) on any
 * drift. Hex is normalized lower-case; both 3- and 6-digit forms are compared
 * by expanding shorthand.
 *
 * Scheme check: global.css carries no per-tint `color-scheme` declaration (the
 * registry is the sole pre-paint authority), so the expected scheme is derived
 * from the CSS bg's perceived luminance — a dark panel MUST be `scheme: 'dark'`
 * and a light panel `scheme: 'light'`. This catches a mislabeled scheme (e.g.
 * a dark tint tagged 'light') that would otherwise flash the wrong paint while
 * the build still passed.
 */
export function assertTintsSyncedWithCss(css: string): void {
  const expand = (hex: string): string => {
    const h = hex.replace('#', '').toLowerCase();
    return h.length === 3
      ? h.split('').map((c) => c + c).join('')
      : h;
  };

  // Perceived luminance (0..1) of a hex bg → the scheme it should carry.
  // sRGB-weighted average; the 6 tints split cleanly (light bgs ≥ 0.5,
  // dark bgs ≈ 0.01), so a 0.5 midpoint is a robust, non-borderline cut.
  const schemeFromBg = (hex: string): 'light' | 'dark' => {
    const h = expand(hex);
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance >= 0.5 ? 'light' : 'dark';
  };

  // :root block → dmg
  const rootMatch = css.match(/:root\s*\{[^}]*?--brand-bg:\s*(#[0-9a-fA-F]{3,6})/);
  const cssBg: Partial<Record<TintId, string>> = {};
  if (rootMatch) cssBg.dmg = rootMatch[1];

  // [data-theme="x"] blocks
  const themeRe =
    /\[data-theme=["']?([a-z0-9]+)["']?\]\s*\{[^}]*?--brand-bg:\s*(#[0-9a-fA-F]{3,6})/g;
  let m: RegExpExecArray | null;
  while ((m = themeRe.exec(css)) !== null) {
    cssBg[m[1] as TintId] = m[2];
  }

  for (const tint of TINTS) {
    const fromCss = cssBg[tint.id];
    if (!fromCss) {
      throw new Error(
        `[tints] no --brand-bg found in global.css for tint "${tint.id}"`
      );
    }
    if (expand(fromCss) !== expand(tint.bg)) {
      throw new Error(
        `[tints] bg drift for "${tint.id}": registry ${tint.bg} vs CSS ${fromCss}`
      );
    }
    const expectedScheme = schemeFromBg(fromCss);
    if (tint.scheme !== expectedScheme) {
      throw new Error(
        `[tints] scheme drift for "${tint.id}": registry "${tint.scheme}" ` +
          `but CSS bg ${fromCss} is ${expectedScheme}`
      );
    }
  }
}
