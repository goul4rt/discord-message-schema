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
    /** Message flag `IsComponentsV2` (1 << 15). Imutável depois de enviada. */
    readonly FLAG_COMPONENTS_V2: 32768;
    /** Componentes na raiz de uma mensagem V2. */
    readonly V2_COMPONENTS_MAX: 10;
    readonly V2_CONTAINER_CHILDREN_MAX: 10;
    readonly V2_SECTION_TEXTS_MAX: 5;
    readonly V2_GALLERY_ITEMS_MAX: 10;
    readonly V2_TEXT_DISPLAY_MAX: 4000;
    /** Soma dos text displays de toda a árvore — análogo aos 6000 dos embeds. */
    readonly V2_TOTAL_CHARS_MAX: 4000;
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
 * Discord Components V2 (message flag 1 << 15).
 *
 * Modela os tipos que o bot já emite hoje em código (painel /familia, painel
 * /backup, ranking ao vivo) para que virem DADO editável no painel web.
 *
 * Regras do Discord que o contrato carrega:
 *  - mensagem com a flag V2 NÃO aceita `content` nem `embeds`;
 *  - a flag é IMUTÁVEL depois de enviada: trocar de V1 para V2 (ou o inverso)
 *    exige apagar a mensagem e repostar, não dá para editar;
 *  - container não aninha container (um nível só).
 *
 * Não há recursão aqui de propósito — o Discord permite apenas um nível de
 * container, então uma união simples resolve sem `z.lazy`.
 */

/** `unfurled media item` da API — só a URL importa no nosso uso. */
declare const mediaItemSchema: z.ZodObject<{
    url: z.ZodString;
}, z.core.$strip>;
/** type 10 — bloco de texto markdown. O conteúdo real das mensagens V2. */
declare const textDisplaySchema: z.ZodObject<{
    type: z.ZodLiteral<10>;
    content: z.ZodString;
}, z.core.$strip>;
/** type 11 — imagem pequena, só como acessório de uma section. */
declare const thumbnailSchema: z.ZodObject<{
    type: z.ZodLiteral<11>;
    media: z.ZodObject<{
        url: z.ZodString;
    }, z.core.$strip>;
    description: z.ZodOptional<z.ZodString>;
    spoiler: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/** type 14 — espaçador, com ou sem linha divisória. */
declare const separatorSchema: z.ZodObject<{
    type: z.ZodLiteral<14>;
    divider: z.ZodOptional<z.ZodBoolean>;
    spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
}, z.core.$strip>;
/** type 12 — grade de imagens. */
declare const mediaGallerySchema: z.ZodObject<{
    type: z.ZodLiteral<12>;
    items: z.ZodArray<z.ZodObject<{
        media: z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodOptional<z.ZodString>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** type 9 — texto com um acessório à direita (thumbnail ou botão). */
declare const sectionSchema: z.ZodObject<{
    type: z.ZodLiteral<9>;
    components: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<10>;
        content: z.ZodString;
    }, z.core.$strip>>;
    accessory: z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<11>;
        media: z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodOptional<z.ZodString>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>]>;
}, z.core.$strip>;
/** Tudo que pode viver dentro de um container (type 17). */
declare const containerSubComponentSchema: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<10>;
    content: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<9>;
    components: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<10>;
        content: z.ZodString;
    }, z.core.$strip>>;
    accessory: z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<11>;
        media: z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodOptional<z.ZodString>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<14>;
    divider: z.ZodOptional<z.ZodBoolean>;
    spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<12>;
    items: z.ZodArray<z.ZodObject<{
        media: z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodOptional<z.ZodString>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>]>;
/** type 17 — cartão com barra colorida à esquerda. O "embed" do V2. */
declare const containerSchema: z.ZodObject<{
    type: z.ZodLiteral<17>;
    components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<10>;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<9>;
        components: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<10>;
            content: z.ZodString;
        }, z.core.$strip>>;
        accessory: z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<11>;
            media: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodOptional<z.ZodString>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<14>;
        divider: z.ZodOptional<z.ZodBoolean>;
        spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<12>;
        items: z.ZodArray<z.ZodObject<{
            media: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodOptional<z.ZodString>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>]>>;
    accent_color: z.ZodOptional<z.ZodNumber>;
    spoiler: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/** Componentes aceitos na raiz de uma mensagem V2. */
declare const componentV2Schema: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<17>;
    components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<10>;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<9>;
        components: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<10>;
            content: z.ZodString;
        }, z.core.$strip>>;
        accessory: z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<11>;
            media: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodOptional<z.ZodString>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<14>;
        divider: z.ZodOptional<z.ZodBoolean>;
        spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<12>;
        items: z.ZodArray<z.ZodObject<{
            media: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodOptional<z.ZodString>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>]>>;
    accent_color: z.ZodOptional<z.ZodNumber>;
    spoiler: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<10>;
    content: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<9>;
    components: z.ZodArray<z.ZodObject<{
        type: z.ZodLiteral<10>;
        content: z.ZodString;
    }, z.core.$strip>>;
    accessory: z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<11>;
        media: z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodOptional<z.ZodString>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<14>;
    divider: z.ZodOptional<z.ZodBoolean>;
    spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<12>;
    items: z.ZodArray<z.ZodObject<{
        media: z.ZodObject<{
            url: z.ZodString;
        }, z.core.$strip>;
        description: z.ZodOptional<z.ZodString>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>]>;
type MediaItem = z.infer<typeof mediaItemSchema>;
type TextDisplay = z.infer<typeof textDisplaySchema>;
type Thumbnail = z.infer<typeof thumbnailSchema>;
type Separator = z.infer<typeof separatorSchema>;
type MediaGallery = z.infer<typeof mediaGallerySchema>;
type Section = z.infer<typeof sectionSchema>;
type Container = z.infer<typeof containerSchema>;
type ComponentV2 = z.infer<typeof componentV2Schema>;
/** `true` se o componente é V2 (qualquer coisa que não seja action row). */
declare function isComponentV2(component: {
    type: number;
}): boolean;
/**
 * Soma dos caracteres de todo text display da árvore — o Discord tem um teto
 * agregado para mensagens V2, análogo aos 6000 chars dos embeds.
 */
declare function componentsV2TotalChars(components: ComponentV2[]): number;

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
    components: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
    }, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<17>;
        components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<10>;
            content: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<9>;
            components: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<10>;
                content: z.ZodString;
            }, z.core.$strip>>;
            accessory: z.ZodUnion<readonly [z.ZodObject<{
                type: z.ZodLiteral<11>;
                media: z.ZodObject<{
                    url: z.ZodString;
                }, z.core.$strip>;
                description: z.ZodOptional<z.ZodString>;
                spoiler: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>, z.ZodObject<{
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
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<14>;
            divider: z.ZodOptional<z.ZodBoolean>;
            spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<12>;
            items: z.ZodArray<z.ZodObject<{
                media: z.ZodObject<{
                    url: z.ZodString;
                }, z.core.$strip>;
                description: z.ZodOptional<z.ZodString>;
                spoiler: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>]>>;
        accent_color: z.ZodOptional<z.ZodNumber>;
        spoiler: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<10>;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<9>;
        components: z.ZodArray<z.ZodObject<{
            type: z.ZodLiteral<10>;
            content: z.ZodString;
        }, z.core.$strip>>;
        accessory: z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<11>;
            media: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodOptional<z.ZodString>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<14>;
        divider: z.ZodOptional<z.ZodBoolean>;
        spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<12>;
        items: z.ZodArray<z.ZodObject<{
            media: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            description: z.ZodOptional<z.ZodString>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
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
    }, z.core.$strip>]>]>>>;
    flags: z.ZodOptional<z.ZodNumber>;
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
        components: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
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
        }, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
            type: z.ZodLiteral<17>;
            components: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
                type: z.ZodLiteral<10>;
                content: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<9>;
                components: z.ZodArray<z.ZodObject<{
                    type: z.ZodLiteral<10>;
                    content: z.ZodString;
                }, z.core.$strip>>;
                accessory: z.ZodUnion<readonly [z.ZodObject<{
                    type: z.ZodLiteral<11>;
                    media: z.ZodObject<{
                        url: z.ZodString;
                    }, z.core.$strip>;
                    description: z.ZodOptional<z.ZodString>;
                    spoiler: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>, z.ZodObject<{
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
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<14>;
                divider: z.ZodOptional<z.ZodBoolean>;
                spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<12>;
                items: z.ZodArray<z.ZodObject<{
                    media: z.ZodObject<{
                        url: z.ZodString;
                    }, z.core.$strip>;
                    description: z.ZodOptional<z.ZodString>;
                    spoiler: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>;
            }, z.core.$strip>, z.ZodObject<{
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
            }, z.core.$strip>]>>;
            accent_color: z.ZodOptional<z.ZodNumber>;
            spoiler: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<10>;
            content: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<9>;
            components: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<10>;
                content: z.ZodString;
            }, z.core.$strip>>;
            accessory: z.ZodUnion<readonly [z.ZodObject<{
                type: z.ZodLiteral<11>;
                media: z.ZodObject<{
                    url: z.ZodString;
                }, z.core.$strip>;
                description: z.ZodOptional<z.ZodString>;
                spoiler: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>, z.ZodObject<{
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
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<14>;
            divider: z.ZodOptional<z.ZodBoolean>;
            spacing: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<12>;
            items: z.ZodArray<z.ZodObject<{
                media: z.ZodObject<{
                    url: z.ZodString;
                }, z.core.$strip>;
                description: z.ZodOptional<z.ZodString>;
                spoiler: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>]>]>>>;
        flags: z.ZodOptional<z.ZodNumber>;
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

/**
 * Painéis interativos (SP2). Config persistida em `GuildConfig.interactivePanels`
 * (Json): o bot lê e executa, o painel web escreve. Cada componente carrega UMA
 * ação + um gate de permissão opcional (sem action-sets — ver spec SP2).
 */

/** "Só estes cargos podem usar este componente." */
declare const panelGateSchema: z.ZodObject<{
    allowedRoleIds: z.ZodArray<z.ZodString>;
    denyMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const panelActionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"reply_text">;
    text: z.ZodString;
    ephemeral: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"role">;
    roleId: z.ZodString;
    mode: z.ZodDefault<z.ZodEnum<{
        toggle: "toggle";
        add: "add";
        remove: "remove";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"saved_msg">;
    customResponseId: z.ZodString;
    ephemeral: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>], "kind">;
declare const panelButtonSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"button">;
    label: z.ZodString;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    style: z.ZodDefault<z.ZodEnum<{
        success: "success";
        primary: "primary";
        secondary: "secondary";
        danger: "danger";
    }>>;
    gate: z.ZodOptional<z.ZodObject<{
        allowedRoleIds: z.ZodArray<z.ZodString>;
        denyMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    action: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"reply_text">;
        text: z.ZodString;
        ephemeral: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"role">;
        roleId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<{
            toggle: "toggle";
            add: "add";
            remove: "remove";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"saved_msg">;
        customResponseId: z.ZodString;
        ephemeral: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>;
declare const panelSelectOptionSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    gate: z.ZodOptional<z.ZodObject<{
        allowedRoleIds: z.ZodArray<z.ZodString>;
        denyMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    action: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"reply_text">;
        text: z.ZodString;
        ephemeral: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"role">;
        roleId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<{
            toggle: "toggle";
            add: "add";
            remove: "remove";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"saved_msg">;
        customResponseId: z.ZodString;
        ephemeral: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>;
declare const panelSelectSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"select">;
    placeholder: z.ZodOptional<z.ZodString>;
    options: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        gate: z.ZodOptional<z.ZodObject<{
            allowedRoleIds: z.ZodArray<z.ZodString>;
            denyMessage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"reply_text">;
            text: z.ZodString;
            ephemeral: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"role">;
            roleId: z.ZodString;
            mode: z.ZodDefault<z.ZodEnum<{
                toggle: "toggle";
                add: "add";
                remove: "remove";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"saved_msg">;
            customResponseId: z.ZodString;
            ephemeral: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>], "kind">;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const panelComponentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"button">;
    label: z.ZodString;
    emoji: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        animated: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    style: z.ZodDefault<z.ZodEnum<{
        success: "success";
        primary: "primary";
        secondary: "secondary";
        danger: "danger";
    }>>;
    gate: z.ZodOptional<z.ZodObject<{
        allowedRoleIds: z.ZodArray<z.ZodString>;
        denyMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    action: z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"reply_text">;
        text: z.ZodString;
        ephemeral: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"role">;
        roleId: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<{
            toggle: "toggle";
            add: "add";
            remove: "remove";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"saved_msg">;
        customResponseId: z.ZodString;
        ephemeral: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>], "kind">;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    type: z.ZodLiteral<"select">;
    placeholder: z.ZodOptional<z.ZodString>;
    options: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        gate: z.ZodOptional<z.ZodObject<{
            allowedRoleIds: z.ZodArray<z.ZodString>;
            denyMessage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"reply_text">;
            text: z.ZodString;
            ephemeral: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"role">;
            roleId: z.ZodString;
            mode: z.ZodDefault<z.ZodEnum<{
                toggle: "toggle";
                add: "add";
                remove: "remove";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"saved_msg">;
            customResponseId: z.ZodString;
            ephemeral: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>], "kind">;
    }, z.core.$strip>>;
}, z.core.$strip>], "type">;
declare const interactivePanelSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    channelId: z.ZodString;
    messageId: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    components: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"button">;
        label: z.ZodString;
        emoji: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
            animated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        style: z.ZodDefault<z.ZodEnum<{
            success: "success";
            primary: "primary";
            secondary: "secondary";
            danger: "danger";
        }>>;
        gate: z.ZodOptional<z.ZodObject<{
            allowedRoleIds: z.ZodArray<z.ZodString>;
            denyMessage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        action: z.ZodDiscriminatedUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"reply_text">;
            text: z.ZodString;
            ephemeral: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"role">;
            roleId: z.ZodString;
            mode: z.ZodDefault<z.ZodEnum<{
                toggle: "toggle";
                add: "add";
                remove: "remove";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            kind: z.ZodLiteral<"saved_msg">;
            customResponseId: z.ZodString;
            ephemeral: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>], "kind">;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        type: z.ZodLiteral<"select">;
        placeholder: z.ZodOptional<z.ZodString>;
        options: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            emoji: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                animated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
            gate: z.ZodOptional<z.ZodObject<{
                allowedRoleIds: z.ZodArray<z.ZodString>;
                denyMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"reply_text">;
                text: z.ZodString;
                ephemeral: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>, z.ZodObject<{
                kind: z.ZodLiteral<"role">;
                roleId: z.ZodString;
                mode: z.ZodDefault<z.ZodEnum<{
                    toggle: "toggle";
                    add: "add";
                    remove: "remove";
                }>>;
            }, z.core.$strip>, z.ZodObject<{
                kind: z.ZodLiteral<"saved_msg">;
                customResponseId: z.ZodString;
                ephemeral: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>], "kind">;
        }, z.core.$strip>>;
    }, z.core.$strip>], "type">>;
}, z.core.$strip>;
declare const interactivePanelsConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    panels: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        channelId: z.ZodString;
        messageId: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
        components: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            id: z.ZodString;
            type: z.ZodLiteral<"button">;
            label: z.ZodString;
            emoji: z.ZodOptional<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                animated: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>>;
            style: z.ZodDefault<z.ZodEnum<{
                success: "success";
                primary: "primary";
                secondary: "secondary";
                danger: "danger";
            }>>;
            gate: z.ZodOptional<z.ZodObject<{
                allowedRoleIds: z.ZodArray<z.ZodString>;
                denyMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"reply_text">;
                text: z.ZodString;
                ephemeral: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>, z.ZodObject<{
                kind: z.ZodLiteral<"role">;
                roleId: z.ZodString;
                mode: z.ZodDefault<z.ZodEnum<{
                    toggle: "toggle";
                    add: "add";
                    remove: "remove";
                }>>;
            }, z.core.$strip>, z.ZodObject<{
                kind: z.ZodLiteral<"saved_msg">;
                customResponseId: z.ZodString;
                ephemeral: z.ZodDefault<z.ZodBoolean>;
            }, z.core.$strip>], "kind">;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            type: z.ZodLiteral<"select">;
            placeholder: z.ZodOptional<z.ZodString>;
            options: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                emoji: z.ZodOptional<z.ZodObject<{
                    id: z.ZodOptional<z.ZodString>;
                    name: z.ZodOptional<z.ZodString>;
                    animated: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>>;
                gate: z.ZodOptional<z.ZodObject<{
                    allowedRoleIds: z.ZodArray<z.ZodString>;
                    denyMessage: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
                action: z.ZodDiscriminatedUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"reply_text">;
                    text: z.ZodString;
                    ephemeral: z.ZodDefault<z.ZodBoolean>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"role">;
                    roleId: z.ZodString;
                    mode: z.ZodDefault<z.ZodEnum<{
                        toggle: "toggle";
                        add: "add";
                        remove: "remove";
                    }>>;
                }, z.core.$strip>, z.ZodObject<{
                    kind: z.ZodLiteral<"saved_msg">;
                    customResponseId: z.ZodString;
                    ephemeral: z.ZodDefault<z.ZodBoolean>;
                }, z.core.$strip>], "kind">;
            }, z.core.$strip>>;
        }, z.core.$strip>], "type">>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type PanelGate = z.infer<typeof panelGateSchema>;
type PanelAction = z.infer<typeof panelActionSchema>;
type PanelButton = z.infer<typeof panelButtonSchema>;
type PanelComponent = z.infer<typeof panelComponentSchema>;
type InteractivePanel = z.infer<typeof interactivePanelSchema>;
type InteractivePanelsConfig = z.infer<typeof interactivePanelsConfigSchema>;

export { type ActionRow, type AllowedMentions, type ComponentV2, type Container, ERROR_CODES, type Embed, type EmbedField, type Emoji, type InteractivePanel, type InteractivePanelsConfig, LIMITS, type Limits, type LinkButton, type MediaGallery, type MediaItem, type Message, type MessageComponent, PLACEHOLDERS, PLACEHOLDER_PATTERN, type PanelAction, type PanelButton, type PanelComponent, type PanelGate, type PlaceholderKey, type Section, type SendErrorCode, type SendMessageRequest, type SendMessageResponse, type Separator, type TextDisplay, type Thumbnail, actionButtonSchema, actionRowSchema, allowedMentionsSchema, componentSchema, componentV2Schema, componentsV2TotalChars, containerSchema, containerSubComponentSchema, containsPlaceholder, embedFieldSchema, embedSchema, embedTotalChars, emojiSchema, interactivePanelSchema, interactivePanelsConfigSchema, isComponentV2, linkButtonSchema, mediaGallerySchema, mediaItemSchema, messageSchema, panelActionSchema, panelButtonSchema, panelComponentSchema, panelGateSchema, panelSelectOptionSchema, panelSelectSchema, resolvePlaceholders, sectionSchema, selectMenuSchema, selectOptionSchema, sendErrorSchema, sendMessageRequestSchema, sendMessageResponseSchema, separatorSchema, snowflakeSchema, textDisplaySchema, thumbnailSchema, urlSchema, usernameSchema };
