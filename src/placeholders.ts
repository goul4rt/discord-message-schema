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
] as const;

export type PlaceholderKey = (typeof PLACEHOLDERS)[number]['key'];

/** Non-global on purpose: `.test()` with the `g` flag is stateful. */
export const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9]*)\s*\}\}/;

export function containsPlaceholder(text: string): boolean {
  return PLACEHOLDER_PATTERN.test(text);
}

function resolveText(text: string, values: Record<string, string>): string {
  return text.replace(
    new RegExp(PLACEHOLDER_PATTERN.source, 'g'),
    (match, key: string) => values[key] ?? match,
  );
}

/** Deep-resolves placeholders in any JSON-like value. Returns a new value; never mutates. */
export function resolvePlaceholders<T>(value: T, values: Record<string, string>): T {
  if (typeof value === 'string') {
    return resolveText(value, values) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolvePlaceholders(item, values)) as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolvePlaceholders(v, values);
    }
    return out as T;
  }
  return value;
}
