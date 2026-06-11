import { z } from 'zod';
import { messageSchema } from './schema/message';

export const snowflakeSchema = z.string().regex(/^\d{17,20}$/, {
  message: 'Must be a Discord snowflake id',
});

export const ERROR_CODES = [
  'INVALID_PAYLOAD',
  'CHANNEL_NOT_FOUND',
  'MISSING_PERMISSIONS',
  'MESSAGE_DELETED',
  'WEBHOOK_CREATE_FAILED',
  'DISCORD_API_ERROR',
] as const;

export type SendErrorCode = (typeof ERROR_CODES)[number];

export const sendErrorSchema = z.object({
  code: z.enum(ERROR_CODES),
  message: z.string(),
  /** Serialized Zod issues when code === 'INVALID_PAYLOAD'. */
  issues: z.array(z.unknown()).optional(),
});

export const sendMessageRequestSchema = z
  .object({
    mode: z.enum(['bot', 'webhook']),
    channelId: snowflakeSchema,
    /** Present = edit this already-sent message instead of sending a new one. */
    messageId: snowflakeSchema.optional(),
    /** Required by the bot to edit messages originally sent through a webhook. */
    webhookId: snowflakeSchema.optional(),
    data: messageSchema,
  })
  .superRefine((request, ctx) => {
    if (request.mode === 'bot') {
      if (request.data.username !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['data', 'username'],
          message: 'username is only allowed in webhook mode',
        });
      }
      if (request.data.avatar_url !== undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['data', 'avatar_url'],
          message: 'avatar_url is only allowed in webhook mode',
        });
      }
    }
  });

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const sendMessageResponseSchema = z.object({
  ok: z.boolean(),
  messageId: snowflakeSchema.optional(),
  channelId: snowflakeSchema.optional(),
  /** Returned on webhook-mode sends so the caller can persist it for future edits. */
  webhookId: snowflakeSchema.optional(),
  error: sendErrorSchema.optional(),
});

export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;
