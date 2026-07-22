// src/limits.ts
var LIMITS = {
  CONTENT_MAX: 2e3,
  /** Webhook username override limit (not the regular account username). */
  USERNAME_MAX: 80,
  EMBEDS_MAX: 10,
  EMBED_TITLE_MAX: 256,
  EMBED_DESCRIPTION_MAX: 4096,
  EMBED_FIELDS_MAX: 25,
  EMBED_FIELD_NAME_MAX: 256,
  EMBED_FIELD_VALUE_MAX: 1024,
  EMBED_FOOTER_TEXT_MAX: 2048,
  EMBED_AUTHOR_NAME_MAX: 256,
  EMBED_COLOR_MAX: 16777215,
  /** Sum of title + description + footer.text + author.name + field names/values across ALL embeds. */
  EMBEDS_TOTAL_CHARS_MAX: 6e3,
  ACTION_ROWS_MAX: 5,
  ROW_COMPONENTS_MAX: 5,
  BUTTON_LABEL_MAX: 80,
  SELECT_OPTIONS_MAX: 25,
  SELECT_PLACEHOLDER_MAX: 150,
  URL_MAX: 2048,
  /** Message flag `IsComponentsV2` (1 << 15). Imutável depois de enviada. */
  FLAG_COMPONENTS_V2: 32768,
  /** Componentes na raiz de uma mensagem V2. */
  V2_COMPONENTS_MAX: 10,
  V2_CONTAINER_CHILDREN_MAX: 10,
  V2_SECTION_TEXTS_MAX: 5,
  V2_GALLERY_ITEMS_MAX: 10,
  V2_TEXT_DISPLAY_MAX: 4e3,
  /** Soma dos text displays de toda a árvore — análogo aos 6000 dos embeds. */
  V2_TOTAL_CHARS_MAX: 4e3
};

// src/placeholders.ts
var PLACEHOLDERS = [
  {
    key: "server",
    token: "{{server}}",
    description: "Nome do servidor",
    example: "Delfus Community"
  },
  {
    key: "memberCount",
    token: "{{memberCount}}",
    description: "Quantidade de membros do servidor",
    example: "1234"
  },
  {
    key: "serverIcon",
    token: "{{serverIcon}}",
    description: "URL do \xEDcone do servidor",
    example: "https://cdn.discordapp.com/embed/avatars/0.png"
  }
];
var PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9]*)\s*\}\}/;
var PLACEHOLDER_PATTERN_GLOBAL = new RegExp(PLACEHOLDER_PATTERN.source, "g");
function containsPlaceholder(text) {
  return PLACEHOLDER_PATTERN.test(text);
}
function resolveText(text, values) {
  PLACEHOLDER_PATTERN_GLOBAL.lastIndex = 0;
  return text.replace(PLACEHOLDER_PATTERN_GLOBAL, (match, key) => values[key] ?? match);
}
function resolvePlaceholders(value, values) {
  if (typeof value === "string") {
    return resolveText(value, values);
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolvePlaceholders(item, values));
  }
  if (value !== null && typeof value === "object") {
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      return value;
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolvePlaceholders(v, values);
    }
    return out;
  }
  return value;
}

// src/schema/embed.ts
import { z } from "zod";
var BARE_PLACEHOLDER = /^\{\{\s*[a-zA-Z][a-zA-Z0-9]*\s*\}\}$/;
var urlSchema = z.string().max(LIMITS.URL_MAX).refine((v) => /^https?:\/\/\S+$/.test(v) || BARE_PLACEHOLDER.test(v), {
  message: "Must be an http(s) URL or a single placeholder token"
});
var embedFieldSchema = z.object({
  name: z.string().min(1).max(LIMITS.EMBED_FIELD_NAME_MAX),
  value: z.string().min(1).max(LIMITS.EMBED_FIELD_VALUE_MAX),
  inline: z.boolean().optional()
});
var embedObjectSchema = z.object({
  title: z.string().min(1).max(LIMITS.EMBED_TITLE_MAX).optional(),
  description: z.string().min(1).max(LIMITS.EMBED_DESCRIPTION_MAX).optional(),
  url: urlSchema.optional(),
  timestamp: z.iso.datetime({ offset: true }).optional(),
  color: z.number().int().min(0).max(LIMITS.EMBED_COLOR_MAX).optional(),
  footer: z.object({
    text: z.string().min(1).max(LIMITS.EMBED_FOOTER_TEXT_MAX),
    icon_url: urlSchema.optional()
  }).optional(),
  author: z.object({
    name: z.string().min(1).max(LIMITS.EMBED_AUTHOR_NAME_MAX),
    url: urlSchema.optional(),
    icon_url: urlSchema.optional()
  }).optional(),
  image: z.object({ url: urlSchema }).optional(),
  thumbnail: z.object({ url: urlSchema }).optional(),
  fields: z.array(embedFieldSchema).max(LIMITS.EMBED_FIELDS_MAX).optional()
});
var embedSchema = embedObjectSchema.superRefine((embed, ctx) => {
  const hasContent = !!embed.title || !!embed.description || !!embed.author || !!embed.footer || !!embed.image || !!embed.thumbnail || (embed.fields?.length ?? 0) > 0;
  if (!hasContent) {
    ctx.addIssue({
      code: "custom",
      message: "Embed must have at least one visible field"
    });
  }
});
function embedTotalChars(embed) {
  let total = (embed.title?.length ?? 0) + (embed.description?.length ?? 0);
  total += embed.footer?.text.length ?? 0;
  total += embed.author?.name.length ?? 0;
  for (const field of embed.fields ?? []) {
    total += field.name.length + field.value.length;
  }
  return total;
}

// src/schema/components.ts
import { z as z2 } from "zod";
var emojiSchema = z2.object({
  id: z2.string().optional(),
  name: z2.string().optional(),
  animated: z2.boolean().optional()
}).refine((e) => !!e.id || !!e.name, {
  message: "Emoji must have a name (unicode) or an id (custom)"
});
var buttonBase = {
  type: z2.literal(2),
  label: z2.string().max(LIMITS.BUTTON_LABEL_MAX).optional(),
  emoji: emojiSchema.optional(),
  disabled: z2.boolean().optional()
};
var requireLabelOrEmoji = (button, ctx) => {
  if (!button.label && !button.emoji) {
    ctx.addIssue({ code: "custom", message: "Button needs a label or an emoji" });
  }
};
var linkButtonSchema = z2.object({ ...buttonBase, style: z2.literal(5), url: urlSchema }).superRefine(requireLabelOrEmoji);
var actionButtonSchema = z2.object({
  ...buttonBase,
  style: z2.union([z2.literal(1), z2.literal(2), z2.literal(3), z2.literal(4)]),
  custom_id: z2.string().min(1).max(100)
}).superRefine(requireLabelOrEmoji);
var selectOptionSchema = z2.object({
  label: z2.string().min(1).max(100),
  value: z2.string().min(1).max(100),
  description: z2.string().max(100).optional(),
  emoji: emojiSchema.optional(),
  default: z2.boolean().optional()
});
var selectMenuSchema = z2.object({
  type: z2.literal(3),
  custom_id: z2.string().min(1).max(100),
  placeholder: z2.string().max(LIMITS.SELECT_PLACEHOLDER_MAX).optional(),
  min_values: z2.number().int().min(0).max(LIMITS.SELECT_OPTIONS_MAX).optional(),
  max_values: z2.number().int().min(1).max(LIMITS.SELECT_OPTIONS_MAX).optional(),
  options: z2.array(selectOptionSchema).min(1).max(LIMITS.SELECT_OPTIONS_MAX)
}).superRefine((menu, ctx) => {
  if (menu.min_values !== void 0 && menu.max_values !== void 0 && menu.min_values > menu.max_values) {
    ctx.addIssue({
      code: "custom",
      path: ["min_values"],
      message: "min_values cannot exceed max_values"
    });
  }
  if (menu.max_values !== void 0 && menu.max_values > menu.options.length) {
    ctx.addIssue({
      code: "custom",
      path: ["max_values"],
      message: "max_values cannot exceed the number of options"
    });
  }
});
var componentSchema = z2.union([
  linkButtonSchema,
  actionButtonSchema,
  selectMenuSchema
]);
var actionRowSchema = z2.object({
  type: z2.literal(1),
  components: z2.array(componentSchema).min(1).max(LIMITS.ROW_COMPONENTS_MAX)
}).superRefine((row, ctx) => {
  row.components.forEach((component, index) => {
    const isLinkButton = component.type === 2 && component.style === 5;
    if (!isLinkButton) {
      ctx.addIssue({
        code: "custom",
        path: ["components", index],
        message: "Only link buttons are supported in v1"
      });
    }
  });
});

// src/schema/components-v2.ts
import { z as z3 } from "zod";
var mediaItemSchema = z3.object({ url: urlSchema });
var textDisplaySchema = z3.object({
  type: z3.literal(10),
  content: z3.string().min(1).max(LIMITS.V2_TEXT_DISPLAY_MAX)
});
var thumbnailSchema = z3.object({
  type: z3.literal(11),
  media: mediaItemSchema,
  description: z3.string().max(1024).optional(),
  spoiler: z3.boolean().optional()
});
var separatorSchema = z3.object({
  type: z3.literal(14),
  divider: z3.boolean().optional(),
  /** 1 = pequeno, 2 = grande. */
  spacing: z3.union([z3.literal(1), z3.literal(2)]).optional()
});
var mediaGallerySchema = z3.object({
  type: z3.literal(12),
  items: z3.array(
    z3.object({
      media: mediaItemSchema,
      description: z3.string().max(1024).optional(),
      spoiler: z3.boolean().optional()
    })
  ).min(1).max(LIMITS.V2_GALLERY_ITEMS_MAX)
});
var sectionSchema = z3.object({
  type: z3.literal(9),
  components: z3.array(textDisplaySchema).min(1).max(LIMITS.V2_SECTION_TEXTS_MAX),
  accessory: z3.union([thumbnailSchema, linkButtonSchema])
});
var containerSubComponentSchema = z3.union([
  textDisplaySchema,
  sectionSchema,
  separatorSchema,
  mediaGallerySchema,
  actionRowSchema
]);
var containerSchema = z3.object({
  type: z3.literal(17),
  components: z3.array(containerSubComponentSchema).min(1).max(LIMITS.V2_CONTAINER_CHILDREN_MAX),
  accent_color: z3.number().int().min(0).max(LIMITS.EMBED_COLOR_MAX).optional(),
  spoiler: z3.boolean().optional()
});
var componentV2Schema = z3.union([
  containerSchema,
  textDisplaySchema,
  sectionSchema,
  separatorSchema,
  mediaGallerySchema,
  actionRowSchema
]);
function isComponentV2(component) {
  return component.type !== 1;
}
function componentsV2TotalChars(components) {
  let total = 0;
  for (const component of components) {
    if (component.type === 10) total += component.content.length;
    else if (component.type === 9) {
      for (const text of component.components) total += text.content.length;
    } else if (component.type === 17) {
      for (const child of component.components) {
        if (child.type === 10) total += child.content.length;
        else if (child.type === 9) {
          for (const text of child.components) total += text.content.length;
        }
      }
    }
  }
  return total;
}

// src/schema/message.ts
import { z as z5 } from "zod";

// src/snowflake.ts
import { z as z4 } from "zod";
var snowflakeSchema = z4.string().regex(/^\d{17,20}$/, {
  message: "Must be a Discord snowflake id"
});

// src/schema/message.ts
var FORBIDDEN_USERNAME_SUBSTRINGS = ["clyde", "discord"];
var FORBIDDEN_USERNAME_EXACT = ["everyone", "here"];
var usernameSchema = z5.string().min(1).max(LIMITS.USERNAME_MAX).superRefine((name, ctx) => {
  const lower = name.toLowerCase();
  if (FORBIDDEN_USERNAME_SUBSTRINGS.some((s) => lower.includes(s))) {
    ctx.addIssue({ code: "custom", message: 'Username cannot contain "clyde" or "discord"' });
  }
  if (FORBIDDEN_USERNAME_EXACT.includes(lower)) {
    ctx.addIssue({ code: "custom", message: 'Username cannot be "everyone" or "here"' });
  }
});
var allowedMentionsSchema = z5.object({
  parse: z5.array(z5.enum(["users", "roles", "everyone"])).optional(),
  users: z5.array(snowflakeSchema).max(100).optional(),
  roles: z5.array(snowflakeSchema).max(100).optional()
}).superRefine((mentions, ctx) => {
  if (mentions.parse?.includes("users") && (mentions.users?.length ?? 0) > 0) {
    ctx.addIssue({
      code: "custom",
      path: ["parse"],
      message: "parse 'users' cannot be combined with an explicit users list"
    });
  }
  if (mentions.parse?.includes("roles") && (mentions.roles?.length ?? 0) > 0) {
    ctx.addIssue({
      code: "custom",
      path: ["parse"],
      message: "parse 'roles' cannot be combined with an explicit roles list"
    });
  }
});
var messageSchema = z5.object({
  content: z5.string().max(LIMITS.CONTENT_MAX).optional(),
  tts: z5.boolean().optional(),
  /** Webhook mode only — sendMessageRequestSchema rejects these in bot mode. */
  username: usernameSchema.optional(),
  avatar_url: urlSchema.optional(),
  embeds: z5.array(embedSchema).max(LIMITS.EMBEDS_MAX).optional(),
  /**
   * V1: action rows (máx. 5). V2: qualquer componente da raiz (máx. 10).
   * Qual dos dois vale é decidido pela flag — ver superRefine abaixo.
   */
  components: z5.array(z5.union([actionRowSchema, componentV2Schema])).max(LIMITS.V2_COMPONENTS_MAX).optional(),
  /**
   * Bitfield de flags da mensagem. Só `FLAG_COMPONENTS_V2` é significativo
   * aqui; a flag NÃO pode ser alterada por edit (trocar de modo exige
   * apagar e repostar).
   */
  flags: z5.number().int().min(0).optional(),
  allowed_mentions: allowedMentionsSchema.optional()
}).superRefine((message, ctx) => {
  const isV2 = ((message.flags ?? 0) & LIMITS.FLAG_COMPONENTS_V2) !== 0;
  const components = message.components ?? [];
  if (isV2) {
    if (message.content) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "Components V2 messages cannot have content"
      });
    }
    if ((message.embeds?.length ?? 0) > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["embeds"],
        message: "Components V2 messages cannot have embeds"
      });
    }
    if (components.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["components"],
        message: "Components V2 messages need at least one component"
      });
    }
    const v2Chars = componentsV2TotalChars(components);
    if (v2Chars > LIMITS.V2_TOTAL_CHARS_MAX) {
      ctx.addIssue({
        code: "custom",
        path: ["components"],
        message: `Components exceed ${LIMITS.V2_TOTAL_CHARS_MAX} total characters (${v2Chars})`
      });
    }
    return;
  }
  components.forEach((component, index) => {
    if (isComponentV2(component)) {
      ctx.addIssue({
        code: "custom",
        path: ["components", index],
        message: "Components V2 require the components v2 message flag"
      });
    }
  });
  if (components.length > LIMITS.ACTION_ROWS_MAX) {
    ctx.addIssue({
      code: "custom",
      path: ["components"],
      message: `At most ${LIMITS.ACTION_ROWS_MAX} action rows`
    });
  }
  const hasBody = !!message.content || (message.embeds?.length ?? 0) > 0 || components.length > 0;
  if (!hasBody) {
    ctx.addIssue({
      code: "custom",
      message: "Message needs content, at least one embed or at least one component"
    });
  }
  const totalChars = (message.embeds ?? []).reduce(
    (sum, embed) => sum + embedTotalChars(embed),
    0
  );
  if (totalChars > LIMITS.EMBEDS_TOTAL_CHARS_MAX) {
    ctx.addIssue({
      code: "custom",
      path: ["embeds"],
      message: `Embeds exceed ${LIMITS.EMBEDS_TOTAL_CHARS_MAX} total characters (${totalChars})`
    });
  }
});

// src/wire.ts
import { z as z6 } from "zod";
var ERROR_CODES = [
  "INVALID_PAYLOAD",
  "CHANNEL_NOT_FOUND",
  "MISSING_PERMISSIONS",
  "MESSAGE_DELETED",
  "WEBHOOK_CREATE_FAILED",
  "DISCORD_API_ERROR"
];
var sendErrorSchema = z6.object({
  code: z6.enum(ERROR_CODES),
  message: z6.string(),
  /** Serialized Zod issues when code === 'INVALID_PAYLOAD'. */
  issues: z6.array(z6.unknown()).optional()
});
var sendMessageRequestSchema = z6.object({
  mode: z6.enum(["bot", "webhook"]),
  channelId: snowflakeSchema,
  /** Present = edit this already-sent message instead of sending a new one. */
  messageId: snowflakeSchema.optional(),
  /** Required by the bot to edit messages originally sent through a webhook. */
  webhookId: snowflakeSchema.optional(),
  data: messageSchema
}).superRefine((request, ctx) => {
  if (request.mode === "bot") {
    if (request.data.username !== void 0) {
      ctx.addIssue({
        code: "custom",
        path: ["data", "username"],
        message: "username is only allowed in webhook mode"
      });
    }
    if (request.data.avatar_url !== void 0) {
      ctx.addIssue({
        code: "custom",
        path: ["data", "avatar_url"],
        message: "avatar_url is only allowed in webhook mode"
      });
    }
  }
  if (request.mode === "webhook" && request.messageId && !request.webhookId) {
    ctx.addIssue({
      code: "custom",
      path: ["webhookId"],
      message: "webhookId is required to edit a webhook message"
    });
  }
});
var sendMessageResponseSchema = z6.discriminatedUnion("ok", [
  z6.object({
    ok: z6.literal(true),
    messageId: snowflakeSchema,
    channelId: snowflakeSchema,
    /** Returned on webhook-mode sends so the caller can persist it for future edits. */
    webhookId: snowflakeSchema.optional()
  }),
  z6.object({
    ok: z6.literal(false),
    error: sendErrorSchema
  })
]);

// src/schema/interactive-panels.ts
import { z as z7 } from "zod";
var panelGateSchema = z7.object({
  allowedRoleIds: z7.array(snowflakeSchema).min(1),
  denyMessage: z7.string().max(2e3).optional()
});
var replyTextActionSchema = z7.object({
  kind: z7.literal("reply_text"),
  text: z7.string().min(1).max(2e3),
  ephemeral: z7.boolean().default(true)
});
var roleActionSchema = z7.object({
  kind: z7.literal("role"),
  roleId: snowflakeSchema,
  mode: z7.enum(["toggle", "add", "remove"]).default("toggle")
});
var savedMsgActionSchema = z7.object({
  kind: z7.literal("saved_msg"),
  customResponseId: z7.string().min(1),
  ephemeral: z7.boolean().default(true)
});
var panelActionSchema = z7.discriminatedUnion("kind", [
  replyTextActionSchema,
  roleActionSchema,
  savedMsgActionSchema
]);
var BUTTON_STYLES = ["primary", "secondary", "success", "danger"];
var panelButtonSchema = z7.object({
  id: z7.string().min(1),
  type: z7.literal("button"),
  label: z7.string().min(1).max(80),
  emoji: emojiSchema.optional(),
  style: z7.enum(BUTTON_STYLES).default("secondary"),
  gate: panelGateSchema.optional(),
  action: panelActionSchema
});
var panelSelectOptionSchema = z7.object({
  id: z7.string().min(1),
  label: z7.string().min(1).max(100),
  description: z7.string().max(100).optional(),
  emoji: emojiSchema.optional(),
  gate: panelGateSchema.optional(),
  action: panelActionSchema
});
var panelSelectSchema = z7.object({
  id: z7.string().min(1),
  type: z7.literal("select"),
  placeholder: z7.string().max(150).optional(),
  options: z7.array(panelSelectOptionSchema).min(1).max(25)
});
var panelComponentSchema = z7.discriminatedUnion("type", [
  panelButtonSchema,
  panelSelectSchema
]);
var interactivePanelSchema = z7.object({
  id: z7.string().min(1),
  name: z7.string().min(1).max(100),
  enabled: z7.boolean().default(true),
  channelId: snowflakeSchema,
  messageId: snowflakeSchema.optional(),
  content: z7.string().max(2e3).optional(),
  components: z7.array(panelComponentSchema).min(1).max(40)
});
var interactivePanelsConfigSchema = z7.object({
  enabled: z7.boolean().default(false),
  panels: z7.array(interactivePanelSchema).default([])
});
export {
  ERROR_CODES,
  LIMITS,
  PLACEHOLDERS,
  PLACEHOLDER_PATTERN,
  actionButtonSchema,
  actionRowSchema,
  allowedMentionsSchema,
  componentSchema,
  componentV2Schema,
  componentsV2TotalChars,
  containerSchema,
  containerSubComponentSchema,
  containsPlaceholder,
  embedFieldSchema,
  embedSchema,
  embedTotalChars,
  emojiSchema,
  interactivePanelSchema,
  interactivePanelsConfigSchema,
  isComponentV2,
  linkButtonSchema,
  mediaGallerySchema,
  mediaItemSchema,
  messageSchema,
  panelActionSchema,
  panelButtonSchema,
  panelComponentSchema,
  panelGateSchema,
  panelSelectOptionSchema,
  panelSelectSchema,
  resolvePlaceholders,
  sectionSchema,
  selectMenuSchema,
  selectOptionSchema,
  sendErrorSchema,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
  separatorSchema,
  snowflakeSchema,
  textDisplaySchema,
  thumbnailSchema,
  urlSchema,
  usernameSchema
};
//# sourceMappingURL=index.js.map