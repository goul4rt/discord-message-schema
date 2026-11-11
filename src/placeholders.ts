/** Variables resolved by the bot at send time and previewed with example values in the editor. */
export const PLACEHOLDERS = [
  {
    key: 'server',
    token: '{{server}}',
    description: 'Nome do servidor',
    example: 'Delfus Community',
  },
  {
    key: 'memberCount',
    token: '{{memberCount}}',
    description: 'Quantidade de membros do servidor',
    example: '1234',
  },
  {
    key: 'serverIcon',
    token: '{{serverIcon}}',
    description: 'URL do ícone do servidor',
    example: 'https://cdn.discordapp.com/embed/avatars/0.png',
  },
  // Data/hora do envio como timestamp do Discord: cada pessoa vê no próprio
  // fuso e idioma. Numa agendada é a hora de cada disparo. O exemplo fixo é
  // 11/11/2026 14:30 UTC, que a prévia renderiza como no Discord.
  {
    key: 'now',
    token: '{{now}}',
    description: 'Data e hora do envio',
    example: '<t:1794407400:f>',
  },
  {
    key: 'nowDate',
    token: '{{nowDate}}',
    description: 'Data do envio',
    example: '<t:1794407400:D>',
  },
  {
    key: 'nowTime',
    token: '{{nowTime}}',
    description: 'Hora do envio',
    example: '<t:1794407400:t>',
  },
  {
    key: 'nowRelative',
    token: '{{nowRelative}}',
    description: 'Há quanto tempo foi enviado (ex.: "há 5 minutos")',
    example: '<t:1794407400:R>',
  },
] as const;

/** Estilos de timestamp do Discord (`<t:segundos:estilo>`). */
export type TimestampStyle = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R';

/** `<t:segundos:estilo>` — o Discord mostra no fuso e idioma de quem lê. */
export function discordTimestamp(date: Date | number, style: TimestampStyle = 'f'): string {
  const seconds = typeof date === 'number' ? Math.floor(date) : Math.floor(date.getTime() / 1000);
  return `<t:${seconds}:${style}>`;
}

/** Valores de `{{now}}`, `{{nowDate}}`, `{{nowTime}}` e `{{nowRelative}}` para `date`. */
export function timePlaceholderValues(date: Date): Record<string, string> {
  return {
    now: discordTimestamp(date, 'f'),
    nowDate: discordTimestamp(date, 'D'),
    nowTime: discordTimestamp(date, 't'),
    nowRelative: discordTimestamp(date, 'R'),
  };
}

export type PlaceholderKey = (typeof PLACEHOLDERS)[number]['key'];

/** Non-global on purpose: `.test()` with the `g` flag is stateful. */
export const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9]*)\s*\}\}/;

const PLACEHOLDER_PATTERN_GLOBAL = new RegExp(PLACEHOLDER_PATTERN.source, 'g');

export function containsPlaceholder(text: string): boolean {
  return PLACEHOLDER_PATTERN.test(text);
}

function resolveText(text: string, values: Record<string, string>): string {
  PLACEHOLDER_PATTERN_GLOBAL.lastIndex = 0;
  return text.replace(PLACEHOLDER_PATTERN_GLOBAL, (match, key: string) => values[key] ?? match);
}

/**
 * Deep-resolves placeholders in any JSON-like value. Returns a new value; never mutates.
 * Only plain JSON types are traversed (string, number, boolean, null, plain object, array);
 * class instances (Date, Map, ...) are passed through unchanged.
 * `values` is intentionally open (Record<string, string>): the bot may resolve
 * context-specific placeholders beyond the published PLACEHOLDERS spec.
 */
export function resolvePlaceholders<T>(value: T, values: Record<string, string>): T {
  // Data/hora valem em todo envio sem cada chamador precisar lembrar; um
  // valor passado explicitamente (ex.: hora agendada) tem prioridade.
  return resolveDeep(value, { ...timePlaceholderValues(new Date()), ...values });
}

function resolveDeep<T>(value: T, values: Record<string, string>): T {
  if (typeof value === 'string') {
    return resolveText(value, values) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveDeep(item, values)) as T;
  }
  if (value !== null && typeof value === 'object') {
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      return value;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveDeep(v, values);
    }
    return out as T;
  }
  return value;
}
