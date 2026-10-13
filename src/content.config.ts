import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string(),
      role: z.string(),
      period: z.string(),
      stack: z.array(z.string()).min(1),
      visibility: z.enum(['public', 'limited']),
      repo: z.url().optional(),
      featured: z.boolean().default(false),
      order: z.number(),
    })
    // Limited projects are confidential: never link their source.
    .refine((data) => !(data.visibility === 'limited' && data.repo), {
      message: 'A limited project must not have a repo link',
      path: ['repo'],
    }),
});

export const collections = { projects };
