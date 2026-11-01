import { z } from 'zod';

export const MECHANICS = ['botao_sorteio', 'escolha', 'escolha_fixa', 'digitar', 'quiz'] as const;
export const OUTCOMES = ['candy', 'trick', 'empty'] as const;
export const RARITIES = ['comum', 'incomum', 'raro'] as const;

const snowflake = z.string().regex(/^\d{17,20}$/);

export const dropOptionSchema = z.object({
  key: z.string().min(1).max(50), // vira sufixo de customId: só [a-z0-9-]
  label: z.string().min(1).max(80),
  emoji: z.string().optional(),
  outcome: z.enum(OUTCOMES).optional(), // escolha_fixa: obrigatório; escolha: ignorado
});

export const dropSchema = z
  .object({
    key: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .max(50),
    mechanic: z.enum(MECHANICS),
    rarity: z.enum(RARITIES).default('comum'),
    embed: z.object({
      title: z.string().max(256),
      description: z.string().max(2000),
      image: z.string().url().optional(),
      color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .optional(),
      footer: z.string().max(200).optional(),
    }),
    duration_seconds: z.number().int().min(15).max(3600).default(120),
    slots: z.number().int().min(1).max(100).default(5), // vencedores (candy) até fechar
    trick_chance: z.number().min(0).max(1).optional(), // override do evento
    empty_chance: z.number().min(0).max(1).default(0),
    points: z.object({ first: z.number().int(), repeat: z.number().int() }).partial().optional(),
    in_activity: z.boolean().default(true), // false = só horário fixo ou manual
    max_per_day: z.number().int().min(1).optional(), // abóbora gigante 1/dia
    button_label: z.string().max(80).optional(), // botao_sorteio
    options: z.array(dropOptionSchema).min(2).max(25).optional(), // escolha | escolha_fixa | quiz
    distribution: z
      .object({
        candy: z.number().int().min(0),
        trick: z.number().int().min(0),
        empty: z.number().int().min(0),
      })
      .optional(), // escolha: sorteado no spawn; soma == options.length
    answers: z.array(z.string().min(1)).min(1).optional(), // digitar | quiz (texto aceito, case/acento-insensível)
    messages: z
      .object({
        candy: z.string().max(1000).optional(),
        trick: z.string().max(1000).optional(),
        empty: z.string().max(1000).optional(),
        late: z.string().max(1000).optional(),
      })
      .prefault({}),
  })
  .superRefine((d, ctx) => {
    if (
      (d.mechanic === 'escolha' || d.mechanic === 'escolha_fixa' || d.mechanic === 'quiz') &&
      !d.options
    )
      ctx.addIssue({ code: 'custom', path: ['options'], message: `${d.key}: options obrigatório` });
    if (d.mechanic === 'escolha_fixa' && d.options?.some(o => !o.outcome))
      ctx.addIssue({
        code: 'custom',
        path: ['options'],
        message: `${d.key}: outcome por opção obrigatório`,
      });
    if (
      d.mechanic === 'escolha' &&
      (!d.distribution ||
        d.distribution.candy + d.distribution.trick + d.distribution.empty !== d.options?.length)
    )
      ctx.addIssue({
        code: 'custom',
        path: ['distribution'],
        message: `${d.key}: distribution deve somar options.length`,
      });
    if ((d.mechanic === 'digitar' || d.mechanic === 'quiz') && !d.answers)
      ctx.addIssue({ code: 'custom', path: ['answers'], message: `${d.key}: answers obrigatório` });
  });

export const eventDropsConfigSchema = z
  .object({
    version: z.literal(1),
    timezone: z.string().default('America/Cuiaba'),
    role_id: snowflake,
    /** Canal da staff para avisos (ex.: falha de hierarquia). Ausente = só log. */
    staff_channel_id: snowflake.optional(),
    event_role_duration: z.enum(['forever', 'event_end']).default('forever'),
    points: z
      .object({ first: z.number().int().default(10), repeat: z.number().int().default(1) })
      .prefault({}),
    trick_chance: z.number().min(0).max(1).default(0.3),
    trick: z.object({ role_id: snowflake, duration_minutes: z.number().int().min(1) }).optional(), // Halloween não preenche
    anti_abuse: z
      .object({
        min_member_age_days: z.number().min(0).default(3),
        excluded_role_ids: z.array(snowflake).default([]),
        max_candies_per_user_per_day: z.number().int().min(1).nullable().default(null),
      })
      .prefault({}),
    activity: z
      .object({
        enabled: z.boolean().default(true),
        channel_ids: z.array(snowflake).min(1),
        window_seconds: z.number().int().default(300),
        threshold: z.number().int().default(15),
        chance: z.number().min(0).max(1).default(0.08),
        channel_cooldown_minutes: z.number().int().default(20),
        global_cooldown_minutes: z.number().int().default(0),
        min_message_length: z.number().int().default(3),
        per_user_seconds: z.number().int().default(20),
        rarity_weights: z
          .object({
            comum: z.number().default(60),
            incomum: z.number().default(30),
            raro: z.number().default(10),
          })
          .prefault({}),
      })
      .optional(),
    schedule: z
      .array(
        z.object({
          at: z.string().datetime({ offset: true }),
          drop_key: z.string(),
          channel_id: snowflake,
        }),
      )
      .default([]),
    drops: z.array(dropSchema).min(1),
    thread: z
      .object({
        forum_ids: z.array(snowflake).min(1),
        allowed_tag_ids: z.array(snowflake).optional(),
        allow_preexisting: z.boolean().default(false),
        min_replies: z.number().int().default(5),
        min_distinct_users: z.number().int().default(3),
        min_chars: z.number().int().default(3),
        reaction_emoji: z.string().default('🎃'),
        max_rewards_per_user: z.number().int().min(1).default(1),
        reply_message: z.string().max(1000).optional(),
        points: z
          .object({ first: z.number().int(), repeat: z.number().int() })
          .partial()
          .optional(),
      })
      .optional(),
  })
  .superRefine((c, ctx) => {
    const keys = new Set(c.drops.map(d => d.key));
    if (keys.size !== c.drops.length) {
      // path aponta a 1ª ocorrência repetida
      const seen = new Set<string>();
      const i = c.drops.findIndex(d => seen.size === seen.add(d.key).size);
      ctx.addIssue({ code: 'custom', path: ['drops', i, 'key'], message: 'drop.key duplicado' });
    }
    c.schedule.forEach((s, i) => {
      if (!keys.has(s.drop_key))
        ctx.addIssue({
          code: 'custom',
          path: ['schedule', i, 'drop_key'],
          message: `schedule: drop_key ${s.drop_key} inexistente`,
        });
    });
  });

export type EventDropsConfig = z.infer<typeof eventDropsConfigSchema>;
export type DropConfig = z.infer<typeof dropSchema>;
export type DropOption = z.infer<typeof dropOptionSchema>;
export type Mechanic = (typeof MECHANICS)[number];
export type Rarity = (typeof RARITIES)[number];
export type Outcome = (typeof OUTCOMES)[number];
