/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 */
import { z } from 'zod';
import { LIMITS } from '../limits';
import { embedSchema, embedTotalChars, urlSchema } from './embed';
import { actionRowSchema } from './components';
import {
  componentV2Schema,
  componentsV2TotalChars,
  isComponentV2,
  type ComponentV2,
} from './components-v2';
import { snowflakeSchema } from '../snowflake';

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

export const allowedMentionsSchema = z
  .object({
    parse: z.array(z.enum(['users', 'roles', 'everyone'])).optional(),
    users: z.array(snowflakeSchema).max(100).optional(),
    roles: z.array(snowflakeSchema).max(100).optional(),
  })
  .superRefine((mentions, ctx) => {
    // Discord rejects parse flags combined with the corresponding explicit ID list.
    if (mentions.parse?.includes('users') && (mentions.users?.length ?? 0) > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['parse'],
        message: "parse 'users' cannot be combined with an explicit users list",
      });
    }
    if (mentions.parse?.includes('roles') && (mentions.roles?.length ?? 0) > 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['parse'],
        message: "parse 'roles' cannot be combined with an explicit roles list",
      });
    }
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
    /**
     * V1: action rows (máx. 5). V2: qualquer componente da raiz (máx. 10).
     * Qual dos dois vale é decidido pela flag — ver superRefine abaixo.
     */
    components: z
      .array(z.union([actionRowSchema, componentV2Schema]))
      .max(LIMITS.V2_COMPONENTS_MAX)
      .optional(),
    /**
     * Bitfield de flags da mensagem. Só `FLAG_COMPONENTS_V2` é significativo
     * aqui; a flag NÃO pode ser alterada por edit (trocar de modo exige
     * apagar e repostar).
     */
    flags: z.number().int().min(0).optional(),
    allowed_mentions: allowedMentionsSchema.optional(),
  })
  .superRefine((message, ctx) => {
    const isV2 = ((message.flags ?? 0) & LIMITS.FLAG_COMPONENTS_V2) !== 0;
    const components = message.components ?? [];

    if (isV2) {
      // Mensagem V2 é só componentes — content e embeds são rejeitados pela API.
      if (message.content) {
        ctx.addIssue({
          code: 'custom',
          path: ['content'],
          message: 'Components V2 messages cannot have content',
        });
      }
      if ((message.embeds?.length ?? 0) > 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['embeds'],
          message: 'Components V2 messages cannot have embeds',
        });
      }
      if (components.length === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['components'],
          message: 'Components V2 messages need at least one component',
        });
      }
      const v2Chars = componentsV2TotalChars(components as ComponentV2[]);
      if (v2Chars > LIMITS.V2_TOTAL_CHARS_MAX) {
        ctx.addIssue({
          code: 'custom',
          path: ['components'],
          message: `Components exceed ${LIMITS.V2_TOTAL_CHARS_MAX} total characters (${v2Chars})`,
        });
      }
      return;
    }

    // V1: só action rows, e no máximo 5.
    components.forEach((component, index) => {
      if (isComponentV2(component)) {
        ctx.addIssue({
          code: 'custom',
          path: ['components', index],
          message: 'Components V2 require the components v2 message flag',
        });
      }
    });
    if (components.length > LIMITS.ACTION_ROWS_MAX) {
      ctx.addIssue({
        code: 'custom',
        path: ['components'],
        message: `At most ${LIMITS.ACTION_ROWS_MAX} action rows`,
      });
    }

    const hasBody =
      !!message.content || (message.embeds?.length ?? 0) > 0 || components.length > 0;
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
