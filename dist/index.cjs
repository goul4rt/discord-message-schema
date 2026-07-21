"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ERROR_CODES: () => ERROR_CODES,
  LIMITS: () => LIMITS,
  PLACEHOLDERS: () => PLACEHOLDERS,
  PLACEHOLDER_PATTERN: () => PLACEHOLDER_PATTERN,
  actionButtonSchema: () => actionButtonSchema,
  actionRowSchema: () => actionRowSchema,
  allowedMentionsSchema: () => allowedMentionsSchema,
  componentSchema: () => componentSchema,
  componentV2Schema: () => componentV2Schema,
  componentsV2TotalChars: () => componentsV2TotalChars,
  containerSchema: () => containerSchema,
  containerSubComponentSchema: () => containerSubComponentSchema,
  containsPlaceholder: () => containsPlaceholder,
  embedFieldSchema: () => embedFieldSchema,
  embedSchema: () => embedSchema,
  embedTotalChars: () => embedTotalChars,
  emojiSchema: () => emojiSchema,
  isComponentV2: () => isComponentV2,
  linkButtonSchema: () => linkButtonSchema,
  mediaGallerySchema: () => mediaGallerySchema,
  mediaItemSchema: () => mediaItemSchema,
  messageSchema: () => messageSchema,
  resolvePlaceholders: () => resolvePlaceholders,
  sectionSchema: () => sectionSchema,
  selectMenuSchema: () => selectMenuSchema,
  selectOptionSchema: () => selectOptionSchema,
  sendErrorSchema: () => sendErrorSchema,
  sendMessageRequestSchema: () => sendMessageRequestSchema,
  sendMessageResponseSchema: () => sendMessageResponseSchema,
  separatorSchema: () => separatorSchema,
  snowflakeSchema: () => snowflakeSchema,
  textDisplaySchema: () => textDisplaySchema,
  thumbnailSchema: () => thumbnailSchema,
  urlSchema: () => urlSchema,
  usernameSchema: () => usernameSchema
});
module.exports = __toCommonJS(index_exports);

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
var import_zod = require("zod");
var BARE_PLACEHOLDER = /^\{\{\s*[a-zA-Z][a-zA-Z0-9]*\s*\}\}$/;
var urlSchema = import_zod.z.string().max(LIMITS.URL_MAX).refine((v) => /^https?:\/\/\S+$/.test(v) || BARE_PLACEHOLDER.test(v), {
  message: "Must be an http(s) URL or a single placeholder token"
});
var embedFieldSchema = import_zod.z.object({
  name: import_zod.z.string().min(1).max(LIMITS.EMBED_FIELD_NAME_MAX),
  value: import_zod.z.string().min(1).max(LIMITS.EMBED_FIELD_VALUE_MAX),
  inline: import_zod.z.boolean().optional()
});
var embedObjectSchema = import_zod.z.object({
  title: import_zod.z.string().min(1).max(LIMITS.EMBED_TITLE_MAX).optional(),
  description: import_zod.z.string().min(1).max(LIMITS.EMBED_DESCRIPTION_MAX).optional(),
  url: urlSchema.optional(),
  timestamp: import_zod.z.iso.datetime({ offset: true }).optional(),
  color: import_zod.z.number().int().min(0).max(LIMITS.EMBED_COLOR_MAX).optional(),
  footer: import_zod.z.object({
    text: import_zod.z.string().min(1).max(LIMITS.EMBED_FOOTER_TEXT_MAX),
    icon_url: urlSchema.optional()
  }).optional(),
  author: import_zod.z.object({
    name: import_zod.z.string().min(1).max(LIMITS.EMBED_AUTHOR_NAME_MAX),
    url: urlSchema.optional(),
    icon_url: urlSchema.optional()
  }).optional(),
  image: import_zod.z.object({ url: urlSchema }).optional(),
  thumbnail: import_zod.z.object({ url: urlSchema }).optional(),
  fields: import_zod.z.array(embedFieldSchema).max(LIMITS.EMBED_FIELDS_MAX).optional()
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
var import_zod2 = require("zod");
var emojiSchema = import_zod2.z.object({
  id: import_zod2.z.string().optional(),
  name: import_zod2.z.string().optional(),
  animated: import_zod2.z.boolean().optional()
}).refine((e) => !!e.id || !!e.name, {
  message: "Emoji must have a name (unicode) or an id (custom)"
});
var buttonBase = {
  type: import_zod2.z.literal(2),
  label: import_zod2.z.string().max(LIMITS.BUTTON_LABEL_MAX).optional(),
  emoji: emojiSchema.optional(),
  disabled: import_zod2.z.boolean().optional()
};
var requireLabelOrEmoji = (button, ctx) => {
  if (!button.label && !button.emoji) {
    ctx.addIssue({ code: "custom", message: "Button needs a label or an emoji" });
  }
};
var linkButtonSchema = import_zod2.z.object({ ...buttonBase, style: import_zod2.z.literal(5), url: urlSchema }).superRefine(requireLabelOrEmoji);
var actionButtonSchema = import_zod2.z.object({
  ...buttonBase,
  style: import_zod2.z.union([import_zod2.z.literal(1), import_zod2.z.literal(2), import_zod2.z.literal(3), import_zod2.z.literal(4)]),
  custom_id: import_zod2.z.string().min(1).max(100)
}).superRefine(requireLabelOrEmoji);
var selectOptionSchema = import_zod2.z.object({
  label: import_zod2.z.string().min(1).max(100),
  value: import_zod2.z.string().min(1).max(100),
  description: import_zod2.z.string().max(100).optional(),
  emoji: emojiSchema.optional(),
  default: import_zod2.z.boolean().optional()
});
var selectMenuSchema = import_zod2.z.object({
  type: import_zod2.z.literal(3),
  custom_id: import_zod2.z.string().min(1).max(100),
  placeholder: import_zod2.z.string().max(LIMITS.SELECT_PLACEHOLDER_MAX).optional(),
  min_values: import_zod2.z.number().int().min(0).max(LIMITS.SELECT_OPTIONS_MAX).optional(),
  max_values: import_zod2.z.number().int().min(1).max(LIMITS.SELECT_OPTIONS_MAX).optional(),
  options: import_zod2.z.array(selectOptionSchema).min(1).max(LIMITS.SELECT_OPTIONS_MAX)
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
var componentSchema = import_zod2.z.union([
  linkButtonSchema,
  actionButtonSchema,
  selectMenuSchema
]);
var actionRowSchema = import_zod2.z.object({
  type: import_zod2.z.literal(1),
  components: import_zod2.z.array(componentSchema).min(1).max(LIMITS.ROW_COMPONENTS_MAX)
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
var import_zod3 = require("zod");
var mediaItemSchema = import_zod3.z.object({ url: urlSchema });
var textDisplaySchema = import_zod3.z.object({
  type: import_zod3.z.literal(10),
  content: import_zod3.z.string().min(1).max(LIMITS.V2_TEXT_DISPLAY_MAX)
});
var thumbnailSchema = import_zod3.z.object({
  type: import_zod3.z.literal(11),
  media: mediaItemSchema,
  description: import_zod3.z.string().max(1024).optional(),
  spoiler: import_zod3.z.boolean().optional()
});
var separatorSchema = import_zod3.z.object({
  type: import_zod3.z.literal(14),
  divider: import_zod3.z.boolean().optional(),
  /** 1 = pequeno, 2 = grande. */
  spacing: import_zod3.z.union([import_zod3.z.literal(1), import_zod3.z.literal(2)]).optional()
});
var mediaGallerySchema = import_zod3.z.object({
  type: import_zod3.z.literal(12),
  items: import_zod3.z.array(
    import_zod3.z.object({
      media: mediaItemSchema,
      description: import_zod3.z.string().max(1024).optional(),
      spoiler: import_zod3.z.boolean().optional()
    })
  ).min(1).max(LIMITS.V2_GALLERY_ITEMS_MAX)
});
var sectionSchema = import_zod3.z.object({
  type: import_zod3.z.literal(9),
  components: import_zod3.z.array(textDisplaySchema).min(1).max(LIMITS.V2_SECTION_TEXTS_MAX),
  accessory: thumbnailSchema
});
var containerSubComponentSchema = import_zod3.z.union([
  textDisplaySchema,
  sectionSchema,
  separatorSchema,
  mediaGallerySchema,
  actionRowSchema
]);
var containerSchema = import_zod3.z.object({
  type: import_zod3.z.literal(17),
  components: import_zod3.z.array(containerSubComponentSchema).min(1).max(LIMITS.V2_CONTAINER_CHILDREN_MAX),
  accent_color: import_zod3.z.number().int().min(0).max(LIMITS.EMBED_COLOR_MAX).optional(),
  spoiler: import_zod3.z.boolean().optional()
});
var componentV2Schema = import_zod3.z.union([
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
var import_zod5 = require("zod");

// src/snowflake.ts
var import_zod4 = require("zod");
var snowflakeSchema = import_zod4.z.string().regex(/^\d{17,20}$/, {
  message: "Must be a Discord snowflake id"
});

// src/schema/message.ts
var FORBIDDEN_USERNAME_SUBSTRINGS = ["clyde", "discord"];
var FORBIDDEN_USERNAME_EXACT = ["everyone", "here"];
var usernameSchema = import_zod5.z.string().min(1).max(LIMITS.USERNAME_MAX).superRefine((name, ctx) => {
  const lower = name.toLowerCase();
  if (FORBIDDEN_USERNAME_SUBSTRINGS.some((s) => lower.includes(s))) {
    ctx.addIssue({ code: "custom", message: 'Username cannot contain "clyde" or "discord"' });
  }
  if (FORBIDDEN_USERNAME_EXACT.includes(lower)) {
    ctx.addIssue({ code: "custom", message: 'Username cannot be "everyone" or "here"' });
  }
});
var allowedMentionsSchema = import_zod5.z.object({
  parse: import_zod5.z.array(import_zod5.z.enum(["users", "roles", "everyone"])).optional(),
  users: import_zod5.z.array(snowflakeSchema).max(100).optional(),
  roles: import_zod5.z.array(snowflakeSchema).max(100).optional()
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
var messageSchema = import_zod5.z.object({
  content: import_zod5.z.string().max(LIMITS.CONTENT_MAX).optional(),
  tts: import_zod5.z.boolean().optional(),
  /** Webhook mode only — sendMessageRequestSchema rejects these in bot mode. */
  username: usernameSchema.optional(),
  avatar_url: urlSchema.optional(),
  embeds: import_zod5.z.array(embedSchema).max(LIMITS.EMBEDS_MAX).optional(),
  /**
   * V1: action rows (máx. 5). V2: qualquer componente da raiz (máx. 10).
   * Qual dos dois vale é decidido pela flag — ver superRefine abaixo.
   */
  components: import_zod5.z.array(import_zod5.z.union([actionRowSchema, componentV2Schema])).max(LIMITS.V2_COMPONENTS_MAX).optional(),
  /**
   * Bitfield de flags da mensagem. Só `FLAG_COMPONENTS_V2` é significativo
   * aqui; a flag NÃO pode ser alterada por edit (trocar de modo exige
   * apagar e repostar).
   */
  flags: import_zod5.z.number().int().min(0).optional(),
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
var import_zod6 = require("zod");
var ERROR_CODES = [
  "INVALID_PAYLOAD",
  "CHANNEL_NOT_FOUND",
  "MISSING_PERMISSIONS",
  "MESSAGE_DELETED",
  "WEBHOOK_CREATE_FAILED",
  "DISCORD_API_ERROR"
];
var sendErrorSchema = import_zod6.z.object({
  code: import_zod6.z.enum(ERROR_CODES),
  message: import_zod6.z.string(),
  /** Serialized Zod issues when code === 'INVALID_PAYLOAD'. */
  issues: import_zod6.z.array(import_zod6.z.unknown()).optional()
});
var sendMessageRequestSchema = import_zod6.z.object({
  mode: import_zod6.z.enum(["bot", "webhook"]),
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
var sendMessageResponseSchema = import_zod6.z.discriminatedUnion("ok", [
  import_zod6.z.object({
    ok: import_zod6.z.literal(true),
    messageId: snowflakeSchema,
    channelId: snowflakeSchema,
    /** Returned on webhook-mode sends so the caller can persist it for future edits. */
    webhookId: snowflakeSchema.optional()
  }),
  import_zod6.z.object({
    ok: import_zod6.z.literal(false),
    error: sendErrorSchema
  })
]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
  isComponentV2,
  linkButtonSchema,
  mediaGallerySchema,
  mediaItemSchema,
  messageSchema,
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
});
//# sourceMappingURL=index.cjs.map