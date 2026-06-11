/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 *
 * v1 contract: only link buttons (style 5) are accepted inside action rows.
 * Action buttons (styles 1-4) and select menus are fully described here so the
 * shape is stable for the future "actions" feature, but messageSchema rejects them.
 */
import { z } from 'zod';
import { LIMITS } from '../limits';
import { urlSchema } from './embed';

export const emojiSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    animated: z.boolean().optional(),
  })
  .refine((e) => !!e.id || !!e.name, {
    message: 'Emoji must have a name (unicode) or an id (custom)',
  });

export type Emoji = z.infer<typeof emojiSchema>;

const buttonBase = {
  type: z.literal(2),
  label: z.string().max(LIMITS.BUTTON_LABEL_MAX).optional(),
  emoji: emojiSchema.optional(),
  disabled: z.boolean().optional(),
};

const requireLabelOrEmoji = (
  button: { label?: string; emoji?: unknown },
  ctx: z.RefinementCtx,
) => {
  if (!button.label && !button.emoji) {
    ctx.addIssue({ code: 'custom', message: 'Button needs a label or an emoji' });
  }
};

/** The only interactive component enabled in v1. */
export const linkButtonSchema = z
  .object({ ...buttonBase, style: z.literal(5), url: urlSchema })
  .superRefine(requireLabelOrEmoji);

export type LinkButton = z.infer<typeof linkButtonSchema>;

/** Reserved for the future actions feature — rejected by actionRowSchema in v1. */
export const actionButtonSchema = z
  .object({
    ...buttonBase,
    style: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    custom_id: z.string().min(1).max(100),
  })
  .superRefine(requireLabelOrEmoji);

export const selectOptionSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  description: z.string().max(100).optional(),
  emoji: emojiSchema.optional(),
  default: z.boolean().optional(),
});

/** Reserved for the future actions feature — rejected by actionRowSchema in v1. */
export const selectMenuSchema = z.object({
  type: z.literal(3),
  custom_id: z.string().min(1).max(100),
  placeholder: z.string().max(LIMITS.SELECT_PLACEHOLDER_MAX).optional(),
  min_values: z.number().int().min(0).max(LIMITS.SELECT_OPTIONS_MAX).optional(),
  max_values: z.number().int().min(1).max(LIMITS.SELECT_OPTIONS_MAX).optional(),
  options: z.array(selectOptionSchema).min(1).max(LIMITS.SELECT_OPTIONS_MAX),
});

export const componentSchema = z.union([
  linkButtonSchema,
  actionButtonSchema,
  selectMenuSchema,
]);

export type MessageComponent = z.infer<typeof componentSchema>;

export const actionRowSchema = z
  .object({
    type: z.literal(1),
    components: z
      .array(componentSchema)
      .min(1)
      .max(LIMITS.ROW_COMPONENTS_MAX),
  })
  .superRefine((row, ctx) => {
    row.components.forEach((component, index) => {
      const isLinkButton = component.type === 2 && component.style === 5;
      if (!isLinkButton) {
        ctx.addIssue({
          code: 'custom',
          path: ['components', index],
          message: 'Only link buttons are supported in v1',
        });
      }
    });
  });

export type ActionRow = z.infer<typeof actionRowSchema>;
