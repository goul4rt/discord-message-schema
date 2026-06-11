import { z } from 'zod';

/**
 * Discord hard limits for messages, embeds and components.
 * Derived from embed-generator (merlinfuchs/embed-generator, MIT)
 * and the Discord API docs.
 */
declare const LIMITS: {
    readonly CONTENT_MAX: 2000;
    /** Webhook username override limit (not the regular account username). */
    readonly USERNAME_MAX: 80;
    readonly EMBEDS_MAX: 10;
    readonly EMBED_TITLE_MAX: 256;
    readonly EMBED_DESCRIPTION_MAX: 4096;
    readonly EMBED_FIELDS_MAX: 25;
    readonly EMBED_FIELD_NAME_MAX: 256;
    readonly EMBED_FIELD_VALUE_MAX: 1024;
    readonly EMBED_FOOTER_TEXT_MAX: 2048;
    readonly EMBED_AUTHOR_NAME_MAX: 256;
    readonly EMBED_COLOR_MAX: 16777215;
    /** Sum of title + description + footer.text + author.name + field names/values across ALL embeds. */
    readonly EMBEDS_TOTAL_CHARS_MAX: 6000;
    readonly ACTION_ROWS_MAX: 5;
    readonly ROW_COMPONENTS_MAX: 5;
    readonly BUTTON_LABEL_MAX: 80;
    readonly SELECT_OPTIONS_MAX: 25;
    readonly SELECT_PLACEHOLDER_MAX: 150;
    readonly URL_MAX: 2048;
};
type Limits = typeof LIMITS;

/** Variables resolved by the bot at send time and previewed with example values in the editor. */
declare const PLACEHOLDERS: readonly [{
    readonly key: "server";
    readonly token: "{{server}}";
    readonly description: "Nome do servidor";
    readonly example: "Delfus Community";
}, {
    readonly key: "memberCount";
    readonly token: "{{memberCount}}";
    readonly description: "Quantidade de membros do servidor";
    readonly example: "1234";
}, {
    readonly key: "serverIcon";
    readonly token: "{{serverIcon}}";
    readonly description: "URL do ícone do servidor";
    readonly example: "https://cdn.discordapp.com/embed/avatars/0.png";
}];
type PlaceholderKey = (typeof PLACEHOLDERS)[number]['key'];
/** Non-global on purpose: `.test()` with the `g` flag is stateful. */
declare const PLACEHOLDER_PATTERN: RegExp;
declare function containsPlaceholder(text: string): boolean;
/**
 * Deep-resolves placeholders in any JSON-like value. Returns a new value; never mutates.
 * Only plain JSON types are traversed (string, number, boolean, null, plain object, array);
 * class instances (Date, Map, ...) are passed through unchanged.
 * `values` is intentionally open (Record<string, string>): the bot may resolve
 * context-specific placeholders beyond the published PLACEHOLDERS spec.
 */
declare function resolvePlaceholders<T>(value: T, values: Record<string, string>): T;

/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 */

declare const urlSchema: z.ZodString;
declare const embedFieldSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    inline: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
type EmbedField = z.infer<typeof embedFieldSchema>;
declare const embedSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodISODateTime>;
    color: z.ZodOptional<z.ZodNumber>;
    footer: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        icon_url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    author: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        icon_url: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
    }, z.core.$strip>>;
    thumbnail: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
    }, z.core.$strip>>;
    fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodString;
        inline: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type Embed = z.infer<typeof embedSchema>;
/** Chars counted by Discord toward the 6000-char total across all embeds. */
declare function embedTotalChars(embed: Embed): number;

/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 *
 * v1 contract: only link buttons (style 5) are accepted inside action rows.
 * Action buttons (styles 1-4) and select menus are fully described here so the
 * shape is stable for the future "actions" feature, but messageSchema rejects them.
 */

declare const emojiSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    animated: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
type Emoji = z.infer<typeof emojiSchema>;
/** The only interactive component enabled in v1. */
declare const linkButtonSchema: z.ZodObject<{
    style: z.ZodLiteral<5>;
    url: z.ZodString;
    type: z.ZodLiteral<2>;
    label: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
type LinkButton = z.infer<typeof linkButtonSchema>;
/** Reserved for the future actions feature — rejected by actionRowSchema in v1. */
declare const actionButtonSchema: z.ZodObject<{
    style: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    custom_id: z.ZodString;
    type: z.ZodLiteral<2>;
    label: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const selectOptionSchema: z.ZodObject<{
    label: z.ZodString;
    value: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    default: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/** Reserved for the future actions feature — rejected by actionRowSchema in v1. */
declare const selectMenuSchema: z.ZodObject<{
    type: z.ZodLiteral<3>;
    custom_id: z.ZodString;
    placeholder: z.ZodOptional<z.ZodString>;
    min_values: z.ZodOptional<z.ZodNumber>;
    max_values: z.ZodOptional<z.ZodNumber>;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        default: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const componentSchema: z.ZodUnion<readonly [z.ZodObject<{
    style: z.ZodLiteral<5>;
    url: z.ZodString;
    type: z.ZodLiteral<2>;
    label: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    style: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    custom_id: z.ZodString;
    type: z.ZodLiteral<2>;
    label: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<3>;
    custom_id: z.ZodString;
    placeholder: z.ZodOptional<z.ZodString>;
    min_values: z.ZodOptional<z.ZodNumber>;
    max_values: z.ZodOptional<z.ZodNumber>;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        default: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>]>;
type MessageComponent = z.infer<typeof componentSchema>;
declare const actionRowSchema: z.ZodObject<{
    type: z.ZodLiteral<1>;
    components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        style: z.ZodLiteral<5>;
        url: z.ZodString;
        type: z.ZodLiteral<2>;
        label: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        style: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        custom_id: z.ZodString;
        type: z.ZodLiteral<2>;
        label: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        disabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<3>;
        custom_id: z.ZodString;
        placeholder: z.ZodOptional<z.ZodString>;
        min_values: z.ZodOptional<z.ZodNumber>;
        max_values: z.ZodOptional<z.ZodNumber>;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            emoji: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                animated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
            default: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>]>>;
}, z.core.$strip>;
type ActionRow = z.infer<typeof actionRowSchema>;

/**
 * Ported and adapted from embed-generator
 * (https://github.com/merlinfuchs/embed-generator, MIT, Copyright 2023 Merlin Fuchs).
 */

declare const usernameSchema: z.ZodString;
declare const allowedMentionsSchema: z.ZodObject<{
    parse: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        everyone: "everyone";
        users: "users";
        roles: "roles";
    }>>>;
    users: z.ZodOptional<z.ZodArray<z.ZodString>>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type AllowedMentions = z.infer<typeof allowedMentionsSchema>;
declare const messageSchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    tts: z.ZodOptional<z.ZodBoolean>;
    username: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodString>;
    embeds: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodOptional<z.ZodISODateTime>;
        color: z.ZodOptional<z.ZodNumber>;
        footer: z.ZodOptional<z.ZodObject<{
            text: z.ZodString;
            icon_url: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        author: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            url: z.ZodOptional<z.ZodString>;
            icon_url: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        image: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>>;
        thumbnail: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>>;
        fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodString;
            inline: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    components: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<1>;
        components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            style: z.ZodLiteral<5>;
            url: z.ZodString;
            type: z.ZodLiteral<2>;
            label: z.ZodOptional<z.ZodString>;
            emoji: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                animated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
            disabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
            style: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
            custom_id: z.ZodString;
            type: z.ZodLiteral<2>;
            label: z.ZodOptional<z.ZodString>;
            emoji: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                animated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
            disabled: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<3>;
            custom_id: z.ZodString;
            placeholder: z.ZodOptional<z.ZodString>;
            min_values: z.ZodOptional<z.ZodNumber>;
            max_values: z.ZodOptional<z.ZodNumber>;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                emoji: z.ZodOptional<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    animated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>;
                default: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
        }, z.core.$strip>]>>;
    }, z.core.$strip>>>;
    allowed_mentions: z.ZodOptional<z.ZodObject<{
        parse: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            everyone: "everyone";
            users: "users";
            roles: "roles";
        }>>>;
        users: z.ZodOptional<z.ZodArray<z.ZodString>>;
        roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type Message = z.infer<typeof messageSchema>;

declare const snowflakeSchema: z.ZodString;

declare const ERROR_CODES: readonly ["INVALID_PAYLOAD", "CHANNEL_NOT_FOUND", "MISSING_PERMISSIONS", "MESSAGE_DELETED", "WEBHOOK_CREATE_FAILED", "DISCORD_API_ERROR"];
type SendErrorCode = (typeof ERROR_CODES)[number];
declare const sendErrorSchema: z.ZodObject<{
    code: z.ZodEnum<{
        INVALID_PAYLOAD: "INVALID_PAYLOAD";
        CHANNEL_NOT_FOUND: "CHANNEL_NOT_FOUND";
        MISSING_PERMISSIONS: "MISSING_PERMISSIONS";
        MESSAGE_DELETED: "MESSAGE_DELETED";
        WEBHOOK_CREATE_FAILED: "WEBHOOK_CREATE_FAILED";
        DISCORD_API_ERROR: "DISCORD_API_ERROR";
    }>;
    message: z.ZodString;
    issues: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
}, z.core.$strip>;
declare const sendMessageRequestSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        bot: "bot";
        webhook: "webhook";
    }>;
    channelId: z.ZodString;
    messageId: z.ZodOptional<z.ZodString>;
    webhookId: z.ZodOptional<z.ZodString>;
    data: z.ZodObject<{
        content: z.ZodOptional<z.ZodString>;
        tts: z.ZodOptional<z.ZodBoolean>;
        username: z.ZodOptional<z.ZodString>;
        avatar_url: z.ZodOptional<z.ZodString>;
        embeds: z.ZodOptional<z.ZodArray<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            url: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodOptional<z.ZodISODateTime>;
            color: z.ZodOptional<z.ZodNumber>;
            footer: z.ZodOptional<z.ZodObject<{
                text: z.ZodString;
                icon_url: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            author: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                url: z.ZodOptional<z.ZodString>;
                icon_url: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            image: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>>;
            thumbnail: z.ZodOptional<z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>>;
            fields: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                value: z.ZodString;
                inline: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
        components: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<1>;
            components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                style: z.ZodLiteral<5>;
                url: z.ZodString;
                type: z.ZodLiteral<2>;
                label: z.ZodOptional<z.ZodString>;
                emoji: z.ZodOptional<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    animated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>;
                disabled: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>, z.ZodObject<{
                style: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
                custom_id: z.ZodString;
                type: z.ZodLiteral<2>;
                label: z.ZodOptional<z.ZodString>;
                emoji: z.ZodOptional<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    animated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>;
                disabled: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<3>;
                custom_id: z.ZodString;
                placeholder: z.ZodOptional<z.ZodString>;
                min_values: z.ZodOptional<z.ZodNumber>;
                max_values: z.ZodOptional<z.ZodNumber>;
                options: z.ZodArray<z.ZodObject<{
                    label: z.ZodString;
                    value: z.ZodString;
                    description: z.ZodOptional<z.ZodString>;
                    emoji: z.ZodOptional<z.ZodObject<{
                        id: z.ZodOptional<z.ZodString>;
                        name: z.ZodOptional<z.ZodString>;
                        animated: z.ZodOptional<z.ZodBoolean>;
                    }, z.core.$strip>>;
                    default: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>;
            }, z.core.$strip>]>>;
        }, z.core.$strip>>>;
        allowed_mentions: z.ZodOptional<z.ZodObject<{
            parse: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                everyone: "everyone";
                users: "users";
                roles: "roles";
            }>>>;
            users: z.ZodOptional<z.ZodArray<z.ZodString>>;
            roles: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;
declare const sendMessageResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    ok: z.ZodLiteral<true>;
    messageId: z.ZodString;
    channelId: z.ZodString;
    webhookId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    ok: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodEnum<{
            INVALID_PAYLOAD: "INVALID_PAYLOAD";
            CHANNEL_NOT_FOUND: "CHANNEL_NOT_FOUND";
            MISSING_PERMISSIONS: "MISSING_PERMISSIONS";
            MESSAGE_DELETED: "MESSAGE_DELETED";
            WEBHOOK_CREATE_FAILED: "WEBHOOK_CREATE_FAILED";
            DISCORD_API_ERROR: "DISCORD_API_ERROR";
        }>;
        message: z.ZodString;
        issues: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    }, z.core.$strip>;
}, z.core.$strip>], "ok">;
type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;

export { type ActionRow, type AllowedMentions, ERROR_CODES, type Embed, type EmbedField, type Emoji, LIMITS, type Limits, type LinkButton, type Message, type MessageComponent, PLACEHOLDERS, PLACEHOLDER_PATTERN, type PlaceholderKey, type SendErrorCode, type SendMessageRequest, type SendMessageResponse, actionButtonSchema, actionRowSchema, allowedMentionsSchema, componentSchema, containsPlaceholder, embedFieldSchema, embedSchema, embedTotalChars, emojiSchema, linkButtonSchema, messageSchema, resolvePlaceholders, selectMenuSchema, selectOptionSchema, sendErrorSchema, sendMessageRequestSchema, sendMessageResponseSchema, snowflakeSchema, urlSchema, usernameSchema };
