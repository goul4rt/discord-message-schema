/**
 * Painéis interativos (SP2). Config persistida em `GuildConfig.interactivePanels`
 * (Json): o bot lê e executa, o painel web escreve. Cada componente carrega UMA
 * ação + um gate de permissão opcional (sem action-sets — ver spec SP2).
 */
import { z } from 'zod';
import { snowflakeSchema } from '../snowflake';
import { emojiSchema } from './components';
import { embedSchema } from './embed';

/** "Só estes cargos podem usar este componente." */
export const panelGateSchema = z.object({
  allowedRoleIds: z.array(snowflakeSchema).min(1),
  denyMessage: z.string().max(2000).optional(),
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

export const panelActionSchema = z.discriminatedUnion('kind', [
  replyTextActionSchema,
  roleActionSchema,
  savedMsgActionSchema,
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
  options: z.array(panelSelectOptionSchema).min(1).max(25),
});

export const panelComponentSchema = z.discriminatedUnion('type', [
  panelButtonSchema,
  panelSelectSchema,
]);

export const interactivePanelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  enabled: z.boolean().default(true),
  channelId: snowflakeSchema,
  messageId: snowflakeSchema.optional(),
  content: z.string().max(2000).optional(),
  embed: embedSchema.optional(),
  components: z.array(panelComponentSchema).min(1).max(40),
});

export const interactivePanelsConfigSchema = z.object({
  enabled: z.boolean().default(false),
  panels: z.array(interactivePanelSchema).default([]),
});

export type PanelGate = z.infer<typeof panelGateSchema>;
export type PanelAction = z.infer<typeof panelActionSchema>;
export type PanelButton = z.infer<typeof panelButtonSchema>;
export type PanelComponent = z.infer<typeof panelComponentSchema>;
export type InteractivePanel = z.infer<typeof interactivePanelSchema>;
export type InteractivePanelsConfig = z.infer<typeof interactivePanelsConfigSchema>;
