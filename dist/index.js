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
  URL_MAX: 2048
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

// src/schema/message.ts
import { z as z4 } from "zod";

// src/snowflake.ts
import { z as z3 } from "zod";
var snowflakeSchema = z3.string().regex(/^\d{17,20}$/, {
  message: "Must be a Discord snowflake id"
});

// src/schema/message.ts
var FORBIDDEN_USERNAME_SUBSTRINGS = ["clyde", "discord"];
var FORBIDDEN_USERNAME_EXACT = ["everyone", "here"];
var usernameSchema = z4.string().min(1).max(LIMITS.USERNAME_MAX).superRefine((name, ctx) => {
  const lower = name.toLowerCase();
  if (FORBIDDEN_USERNAME_SUBSTRINGS.some((s) => lower.includes(s))) {
    ctx.addIssue({ code: "custom", message: 'Username cannot contain "clyde" or "discord"' });
  }
  if (FORBIDDEN_USERNAME_EXACT.includes(lower)) {
    ctx.addIssue({ code: "custom", message: 'Username cannot be "everyone" or "here"' });
  }
});
var allowedMentionsSchema = z4.object({
  parse: z4.array(z4.enum(["users", "roles", "everyone"])).optional(),
  users: z4.array(snowflakeSchema).max(100).optional(),
  roles: z4.array(snowflakeSchema).max(100).optional()
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
var messageSchema = z4.object({
  content: z4.string().max(LIMITS.CONTENT_MAX).optional(),
  tts: z4.boolean().optional(),
  /** Webhook mode only — sendMessageRequestSchema rejects these in bot mode. */
  username: usernameSchema.optional(),
  avatar_url: urlSchema.optional(),
  embeds: z4.array(embedSchema).max(LIMITS.EMBEDS_MAX).optional(),
  components: z4.array(actionRowSchema).max(LIMITS.ACTION_ROWS_MAX).optional(),
  allowed_mentions: allowedMentionsSchema.optional()
}).superRefine((message, ctx) => {
  const hasBody = !!message.content || (message.embeds?.length ?? 0) > 0 || (message.components?.length ?? 0) > 0;
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
import { z as z5 } from "zod";
var ERROR_CODES = [
  "INVALID_PAYLOAD",
  "CHANNEL_NOT_FOUND",
  "MISSING_PERMISSIONS",
  "MESSAGE_DELETED",
  "WEBHOOK_CREATE_FAILED",
  "DISCORD_API_ERROR"
];
var sendErrorSchema = z5.object({
  code: z5.enum(ERROR_CODES),
  message: z5.string(),
  /** Serialized Zod issues when code === 'INVALID_PAYLOAD'. */
  issues: z5.array(z5.unknown()).optional()
});
var sendMessageRequestSchema = z5.object({
  mode: z5.enum(["bot", "webhook"]),
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
var sendMessageResponseSchema = z5.discriminatedUnion("ok", [
  z5.object({
    ok: z5.literal(true),
    messageId: snowflakeSchema,
    channelId: snowflakeSchema,
    /** Returned on webhook-mode sends so the caller can persist it for future edits. */
    webhookId: snowflakeSchema.optional()
  }),
  z5.object({
    ok: z5.literal(false),
    error: sendErrorSchema
  })
]);
export {
  ERROR_CODES,
  LIMITS,
  PLACEHOLDERS,
  PLACEHOLDER_PATTERN,
  actionButtonSchema,
  actionRowSchema,
  allowedMentionsSchema,
  componentSchema,
  containsPlaceholder,
  embedFieldSchema,
  embedSchema,
  embedTotalChars,
  emojiSchema,
  linkButtonSchema,
  messageSchema,
  resolvePlaceholders,
  selectMenuSchema,
  selectOptionSchema,
  sendErrorSchema,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
  snowflakeSchema,
  urlSchema,
  usernameSchema
};
//# sourceMappingURL=index.js.map