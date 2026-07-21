/**
 * Discord hard limits for messages, embeds and components.
 * Derived from embed-generator (merlinfuchs/embed-generator, MIT)
 * and the Discord API docs.
 */
export const LIMITS = {
  CONTENT_MAX: 2000,
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
  EMBED_COLOR_MAX: 0xffffff,
  /** Sum of title + description + footer.text + author.name + field names/values across ALL embeds. */
  EMBEDS_TOTAL_CHARS_MAX: 6000,
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
  V2_TEXT_DISPLAY_MAX: 4000,
  /** Soma dos text displays de toda a árvore — análogo aos 6000 dos embeds. */
  V2_TOTAL_CHARS_MAX: 4000,
} as const;

export type Limits = typeof LIMITS;
