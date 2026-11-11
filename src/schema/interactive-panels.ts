/**
 * Painéis interativos (SP2). Config persistida em `GuildConfig.interactivePanels`
 * (Json): o bot lê e executa, o painel web escreve. Cada componente carrega UMA
 * ação + um gate de permissão opcional (sem action-sets — ver spec SP2).
 */
import { z } from 'zod';
import { snowflakeSchema } from '../snowflake';
import { emojiSchema } from './components';
import { embedSchema, embedTotalChars } from './embed';
import { componentV2Schema, componentsV2TotalChars, countComponentsV2 } from './components-v2';
import { LIMITS } from '../limits';

/** Mensagem enviada por DM ao perder a tag: texto ou mensagem do criador (embed). */
export const tagLossDmSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('text'), text: z.string().min(1).max(2000) }),
  z.object({ kind: z.literal('saved_message'), savedMessageId: z.string().min(1) }),
]);

/**
 * Quem pode usar o componente. Condições somam (E): cargos permitidos e/ou
 * exigir a tag do servidor ativa no perfil (primary guild do Discord).
 * Precisa de pelo menos uma condição.
 */
export const panelGateSchema = z
  .object({
    allowedRoleIds: z.array(snowflakeSchema).default([]),
    requireServerTag: z.boolean().optional(),
    /** DM opcional quando a pessoa tira a tag e perde o cargo da recompensa.
     *  Frequência travada pelo bot (não configurável por servidor). */
    tagLossDm: tagLossDmSchema.optional(),
    denyMessage: z.string().max(2000).optional(),
  })
  .refine((g) => g.allowedRoleIds.length > 0 || g.requireServerTag === true, {
    message: 'gate precisa de cargos permitidos ou da tag do servidor',
    path: ['allowedRoleIds'],
  });

export const replyTextActionSchema = z.object({
  kind: z.literal('reply_text'),
  text: z.string().min(1).max(2000),
  ephemeral: z.boolean().default(true),
});

export const roleActionSchema = z.object({
  kind: z.literal('role'),
  roleId: snowflakeSchema,
  mode: z.enum(['toggle', 'add', 'remove']).default('toggle'),
});

export const savedMsgActionSchema = z.object({
  kind: z.literal('saved_msg'),
  customResponseId: z.string().min(1),
  ephemeral: z.boolean().default(true),
});

/** Responde com uma mensagem do criador de mensagens (tabela saved_messages). */
export const savedMessageActionSchema = z.object({
  kind: z.literal('saved_message'),
  savedMessageId: z.string().min(1),
  ephemeral: z.boolean().default(true),
});

export const panelActionSchema = z.discriminatedUnion('kind', [
  replyTextActionSchema,
  roleActionSchema,
  savedMsgActionSchema,
  savedMessageActionSchema,
]);

const BUTTON_STYLES = ['primary', 'secondary', 'success', 'danger'] as const;

export const panelButtonSchema = z.object({
  id: z.string().min(1),
  type: z.literal('button'),
  label: z.string().min(1).max(80),
  emoji: emojiSchema.optional(),
  style: z.enum(BUTTON_STYLES).default('secondary'),
  gate: panelGateSchema.optional(),
  action: panelActionSchema,
});

export const panelSelectOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(100),
  description: z.string().max(100).optional(),
  emoji: emojiSchema.optional(),
  gate: panelGateSchema.optional(),
  action: panelActionSchema,
});

export const panelSelectSchema = z.object({
  id: z.string().min(1),
  type: z.literal('select'),
  placeholder: z.string().max(150).optional(),
  /**
   * Volta o menu ao placeholder depois de cada escolha. Sem isso o Discord
   * continua mostrando a opção escolhida e escolher a mesma de novo não manda
   * nada (num menu de cargo liga/desliga, não dá para tirar o cargo).
   * Ausente = true: o bot limpa por padrão; `false` mantém a escolha visível.
   */
  clearAfterUse: z.boolean().optional(),
  options: z.array(panelSelectOptionSchema).min(1).max(25),
});

export const panelComponentSchema = z.discriminatedUnion('type', [
  panelButtonSchema,
  panelSelectSchema,
]);

/**
 * Quantas linhas as automações ocupam no deploy — espelha o bot: botões
 * seguidos agrupam de 5 em 5 e cada menu ocupa a sua linha (e fecha o grupo
 * de botões anterior, então a ordem importa).
 */
export function countPanelAutomationRows(components: { type: 'button' | 'select' }[]): number {
  let rows = 0;
  let buttons = 0;
  for (const c of components) {
    if (c.type === 'select') {
      rows += Math.ceil(buttons / 5) + 1;
      buttons = 0;
    } else buttons++;
  }
  return rows + Math.ceil(buttons / 5);
}

/** Componentes que as automações somam no teto de 40: linhas + cada botão/menu. */
export function countPanelAutomationComponents(
  components: { type: 'button' | 'select' }[],
): number {
  return countPanelAutomationRows(components) + components.length;
}

export const interactivePanelSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1).max(100),
    enabled: z.boolean().default(true),
    channelId: snowflakeSchema,
    messageId: snowflakeSchema.optional(),
    content: z.string().max(2000).optional(),
    /** Legado (até 0.9): um embed só. Painéis novos gravam `embeds`; o bot
     *  posta `embeds ?? [embed]`. */
    embed: embedSchema.optional(),
    embeds: z.array(embedSchema).min(1).max(LIMITS.EMBEDS_MAX).optional(),
    /** Corpo em Components V2 (flag 1<<15 derivada pelo bot no deploy — a
     *  flag NÃO é persistida). Exclusivo com `embed`/`content`: o Discord não
     *  aceita content/embeds numa mensagem com a flag V2. */
    componentsV2: z
      .array(componentV2Schema)
      .min(1)
      .max(LIMITS.V2_COMPONENTS_MAX)
      .optional(),
    components: z.array(panelComponentSchema).min(1).max(40),
  })
  .superRefine((panel, ctx) => {
    if (panel.embeds) {
      if (panel.embed) {
        ctx.addIssue({
          code: 'custom',
          path: ['embed'],
          message: 'use embeds ou embed, não os dois',
        });
      }
      const total = panel.embeds.reduce((sum, e) => sum + embedTotalChars(e), 0);
      if (total > LIMITS.EMBEDS_TOTAL_CHARS_MAX) {
        ctx.addIssue({
          code: 'custom',
          path: ['embeds'],
          message: `os embeds passam do teto de ${LIMITS.EMBEDS_TOTAL_CHARS_MAX} caracteres somados`,
        });
      }
    }
    if (!panel.componentsV2) return;
    if (panel.embed || panel.embeds) {
      ctx.addIssue({
        code: 'custom',
        path: ['componentsV2'],
        message: 'embed e componentsV2 são mutuamente exclusivos',
      });
    }
    if (panel.content) {
      ctx.addIssue({
        code: 'custom',
        path: ['content'],
        message: 'content não é permitido com componentsV2 (flag V2 do Discord)',
      });
    }
    // Teto agregado de caracteres da mensagem V2 — cada nó tem limite próprio,
    // mas a soma também estoura na API se passar do total.
    const total =
      countComponentsV2(panel.componentsV2) + countPanelAutomationComponents(panel.components);
    if (total > LIMITS.V2_TOTAL_COMPONENTS_MAX) {
      ctx.addIssue({
        code: 'custom',
        path: ['componentsV2'],
        message: `blocos + botões/menus somam ${total} componentes; o Discord aceita ${LIMITS.V2_TOTAL_COMPONENTS_MAX}`,
      });
    }
    if (componentsV2TotalChars(panel.componentsV2) > LIMITS.V2_TOTAL_CHARS_MAX) {
      ctx.addIssue({
        code: 'custom',
        path: ['componentsV2'],
        message: `componentsV2 passa do teto de ${LIMITS.V2_TOTAL_CHARS_MAX} caracteres da mensagem V2`,
      });
    }
  });

export const interactivePanelsConfigSchema = z.object({
  enabled: z.boolean().default(false),
  panels: z.array(interactivePanelSchema).default([]),
});

export type PanelGate = z.infer<typeof panelGateSchema>;
export type TagLossDm = z.infer<typeof tagLossDmSchema>;
export type PanelAction = z.infer<typeof panelActionSchema>;
export type PanelButton = z.infer<typeof panelButtonSchema>;
export type PanelComponent = z.infer<typeof panelComponentSchema>;
export type PanelSelect = z.infer<typeof panelSelectSchema>;
export type InteractivePanel = z.infer<typeof interactivePanelSchema>;
export type InteractivePanelsConfig = z.infer<typeof interactivePanelsConfigSchema>;
