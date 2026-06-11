import { z } from 'zod';
import { messageSchema } from './schema/message';
import { snowflakeSchema } from './snowflake';

export { snowflakeSchema } from './snowflake';

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
    if (request.mode === 'webhook' && request.messageId && !request.webhookId) {
      ctx.addIssue({
        code: 'custom',
        path: ['webhookId'],
        message: 'webhookId is required to edit a webhook message',
      });
    }
  });

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const sendMessageResponseSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    messageId: snowflakeSchema,
    channelId: snowflakeSchema,
    /** Returned on webhook-mode sends so the caller can persist it for future edits. */
    webhookId: snowflakeSchema.optional(),
  }),
  z.object({
    ok: z.literal(false),
    error: sendErrorSchema,
  }),
]);

export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;
