/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 */
import { z } from 'zod';
import { LIMITS } from '../limits';

const BARE_PLACEHOLDER = /^\{\{\s*[a-zA-Z][a-zA-Z0-9]*\s*\}\}$/;

export const urlSchema = z
  .string()
  .max(LIMITS.URL_MAX)
  .refine((v) => /^https?:\/\/\S+$/.test(v) || BARE_PLACEHOLDER.test(v), {
    message: 'Must be an http(s) URL or a single placeholder token',
  });

export const embedFieldSchema = z.object({
  name: z.string().min(1).max(LIMITS.EMBED_FIELD_NAME_MAX),
  value: z.string().min(1).max(LIMITS.EMBED_FIELD_VALUE_MAX),
  inline: z.boolean().optional(),
});

export type EmbedField = z.infer<typeof embedFieldSchema>;

const embedObjectSchema = z.object({
  title: z.string().min(1).max(LIMITS.EMBED_TITLE_MAX).optional(),
  description: z.string().min(1).max(LIMITS.EMBED_DESCRIPTION_MAX).optional(),
  url: urlSchema.optional(),
  timestamp: z.iso.datetime({ offset: true }).optional(),
  color: z.number().int().min(0).max(LIMITS.EMBED_COLOR_MAX).optional(),
  footer: z
    .object({
      text: z.string().min(1).max(LIMITS.EMBED_FOOTER_TEXT_MAX),
      icon_url: urlSchema.optional(),
    })
    .optional(),
  author: z
    .object({
      name: z.string().min(1).max(LIMITS.EMBED_AUTHOR_NAME_MAX),
      url: urlSchema.optional(),
      icon_url: urlSchema.optional(),
    })
    .optional(),
  image: z.object({ url: urlSchema }).optional(),
  thumbnail: z.object({ url: urlSchema }).optional(),
  fields: z.array(embedFieldSchema).max(LIMITS.EMBED_FIELDS_MAX).optional(),
});

export const embedSchema = embedObjectSchema.superRefine((embed, ctx) => {
  const hasContent =
    !!embed.title ||
    !!embed.description ||
    !!embed.author ||
    !!embed.footer ||
    !!embed.image ||
    !!embed.thumbnail ||
    (embed.fields?.length ?? 0) > 0;
  if (!hasContent) {
    ctx.addIssue({
      code: 'custom',
      message: 'Embed must have at least one visible field',
    });
  }
});

export type Embed = z.infer<typeof embedSchema>;

/** Chars counted by Discord toward the 6000-char total across all embeds. */
export function embedTotalChars(embed: Embed): number {
  let total = (embed.title?.length ?? 0) + (embed.description?.length ?? 0);
  total += embed.footer?.text.length ?? 0;
  total += embed.author?.name.length ?? 0;
  for (const field of embed.fields ?? []) {
    total += field.name.length + field.value.length;
  }
  return total;
}
