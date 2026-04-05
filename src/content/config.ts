import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    externalUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
})

const photography = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    location: z.string(),
    date: z.string(),
    coverImage: z.string().url(),
    gallery: z.array(
      z.object({
        src: z.string().url(),
        alt: z.string(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
    ),
    camera: z.string().optional(),
    filmOrLens: z.string().optional(),
    featured: z.boolean().default(false),
  }),
})

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    publishedAt: z.string().optional(),
  }),
})

export const collections = { projects, photography, writing }
