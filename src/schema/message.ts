/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 */
import { z } from 'zod';
import { LIMITS } from '../limits';
import { embedSchema, embedTotalChars, urlSchema } from './embed';
import { actionRowSchema } from './components';

const FORBIDDEN_USERNAME_SUBSTRINGS = ['clyde', 'discord'];
const FORBIDDEN_USERNAME_EXACT = ['everyone', 'here'];

export const usernameSchema = z
  .string()
  .min(1)
  .max(LIMITS.USERNAME_MAX)
  .superRefine((name, ctx) => {
    const lower = name.toLowerCase();
    if (FORBIDDEN_USERNAME_SUBSTRINGS.some((s) => lower.includes(s))) {
      ctx.addIssue({ code: 'custom', message: 'Username cannot contain "clyde" or "discord"' });
    }
    if (FORBIDDEN_USERNAME_EXACT.includes(lower)) {
      ctx.addIssue({ code: 'custom', message: 'Username cannot be "everyone" or "here"' });
    }
  });

export const allowedMentionsSchema = z.object({
  parse: z.array(z.enum(['users', 'roles', 'everyone'])).optional(),
  users: z.array(z.string()).max(100).optional(),
  roles: z.array(z.string()).max(100).optional(),
});

export type AllowedMentions = z.infer<typeof allowedMentionsSchema>;

export const messageSchema = z
  .object({
    content: z.string().max(LIMITS.CONTENT_MAX).optional(),
    tts: z.boolean().optional(),
    /** Webhook mode only — sendMessageRequestSchema rejects these in bot mode. */
    username: usernameSchema.optional(),
    avatar_url: urlSchema.optional(),
    embeds: z.array(embedSchema).max(LIMITS.EMBEDS_MAX).optional(),
    components: z.array(actionRowSchema).max(LIMITS.ACTION_ROWS_MAX).optional(),
    allowed_mentions: allowedMentionsSchema.optional(),
  })
  .superRefine((message, ctx) => {
    const hasBody =
      !!message.content ||
      (message.embeds?.length ?? 0) > 0 ||
      (message.components?.length ?? 0) > 0;
    if (!hasBody) {
      ctx.addIssue({
        code: 'custom',
        message: 'Message needs content, at least one embed or at least one component',
      });
    }

    const totalChars = (message.embeds ?? []).reduce(
      (sum, embed) => sum + embedTotalChars(embed),
      0,
    );
    if (totalChars > LIMITS.EMBEDS_TOTAL_CHARS_MAX) {
      ctx.addIssue({
        code: 'custom',
        path: ['embeds'],
        message: `Embeds exceed ${LIMITS.EMBEDS_TOTAL_CHARS_MAX} total characters (${totalChars})`,
      });
    }
  });

export type Message = z.infer<typeof messageSchema>;
