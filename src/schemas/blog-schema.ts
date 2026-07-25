import { z } from 'zod';

// ============================================
// ZOD SCHEMA
// ============================================
export const blogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')
    .max(120, 'Slug too long'),

  coverImage: z
    .string()
    .min(1, 'Cover image is required')
    .url('Must be a valid URL'),

  ogImage: z
    .string()
    .min(1, 'OG image is required')
    .url('Must be a valid URL'),

  isFeatured: z
    .boolean()
    .default(false),

  content: z.object({
    blocks: z.array(z.any()).min(1, 'Blog content cannot be empty'),
  }).refine((data) => data.blocks.length > 0, {
    message: 'Blog content is required',
  }),

});

export type BlogSchemaType = z.infer<typeof blogSchema>;

// ============================================
// UTILS
// ============================================
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};