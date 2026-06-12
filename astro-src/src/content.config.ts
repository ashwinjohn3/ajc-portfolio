import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// work — one markdown file per role; frontmatter holds metadata,
// body holds the free-form bullets/description block.
// ---------------------------------------------------------------------------
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Job title, e.g. "Software Development Engineer II" */
    title: z.string(),
    /** Employer name, e.g. "Amazon Web Services" */
    company: z.string(),
    /** Display period, e.g. "2022–2026" */
    period: z.string(),
    /** Optional sub-role or course name */
    subtitle: z.string().optional(),
    /**
     * Sort order — lower numbers appear first in the timeline.
     * Reflects chronological reverse order (most recent = lowest number).
     */
    order: z.number().int().nonnegative(),
    /**
     * Structured bullet points with optional hyperlink and team label.
     * Kept in frontmatter so page builders can render them with custom markup;
     * the markdown body is available as fallback / additional context.
     */
    bullets: z
      .array(
        z.object({
          text: z.string(),
          href: z.string().url().optional(),
          team: z.string().optional(),
        })
      )
      .optional(),
  }),
});

// ---------------------------------------------------------------------------
// uses — tools/gear the site owner uses; one markdown file per category.
// Placeholder entries are marked with TODO in the description field.
// ---------------------------------------------------------------------------
const uses = defineCollection({
  loader: glob({ base: './src/content/uses', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    /** Display name for the category, e.g. "Editor & Terminal" */
    category: z.string(),
    /** Sort order across categories — lower = listed first */
    order: z.number().int().nonnegative(),
    items: z.array(
      z.object({
        name: z.string(),
        /** Short description — may include "TODO:" to flag placeholders */
        description: z.string().optional(),
        /** Optional link to the tool's website */
        url: z.string().url().optional(),
      })
    ),
  }),
});

export const collections = { work, uses };
