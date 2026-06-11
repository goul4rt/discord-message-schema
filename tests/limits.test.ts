import { describe, expect, it } from 'vitest';
import { LIMITS } from '../src/limits';

describe('LIMITS', () => {
  it('expõe os limites oficiais do Discord', () => {
    expect(LIMITS.CONTENT_MAX).toBe(2000);
    expect(LIMITS.USERNAME_MAX).toBe(80);
    expect(LIMITS.EMBEDS_MAX).toBe(10);
    expect(LIMITS.EMBED_TITLE_MAX).toBe(256);
    expect(LIMITS.EMBED_DESCRIPTION_MAX).toBe(4096);
    expect(LIMITS.EMBED_FIELDS_MAX).toBe(25);
    expect(LIMITS.EMBED_FIELD_NAME_MAX).toBe(256);
    expect(LIMITS.EMBED_FIELD_VALUE_MAX).toBe(1024);
    expect(LIMITS.EMBED_FOOTER_TEXT_MAX).toBe(2048);
    expect(LIMITS.EMBED_AUTHOR_NAME_MAX).toBe(256);
    expect(LIMITS.EMBED_COLOR_MAX).toBe(0xffffff);
    expect(LIMITS.EMBEDS_TOTAL_CHARS_MAX).toBe(6000);
    expect(LIMITS.ACTION_ROWS_MAX).toBe(5);
    expect(LIMITS.ROW_COMPONENTS_MAX).toBe(5);
    expect(LIMITS.BUTTON_LABEL_MAX).toBe(80);
    expect(LIMITS.SELECT_OPTIONS_MAX).toBe(25);
    expect(LIMITS.SELECT_PLACEHOLDER_MAX).toBe(150);
    expect(LIMITS.URL_MAX).toBe(2048);
  });
});
