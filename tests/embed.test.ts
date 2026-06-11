import { describe, expect, it } from 'vitest';
import {
  embedFieldSchema,
  embedSchema,
  embedTotalChars,
  urlSchema,
} from '../src/schema/embed';

describe('urlSchema', () => {
  it('aceita http(s) e strings com placeholder', () => {
    expect(urlSchema.safeParse('https://delfus.app').success).toBe(true);
    expect(urlSchema.safeParse('http://delfus.app/x?a=1').success).toBe(true);
    expect(urlSchema.safeParse('{{serverIcon}}').success).toBe(true);
  });

  it('rejeita outros protocolos e texto solto', () => {
    expect(urlSchema.safeParse('ftp://x.com').success).toBe(false);
    expect(urlSchema.safeParse('javascript:alert(1)').success).toBe(false);
    expect(urlSchema.safeParse('não é url').success).toBe(false);
  });
});

describe('embedFieldSchema', () => {
  it('exige name 1..256 e value 1..1024', () => {
    expect(embedFieldSchema.safeParse({ name: 'a', value: 'b' }).success).toBe(true);
    expect(embedFieldSchema.safeParse({ name: '', value: 'b' }).success).toBe(false);
    expect(
      embedFieldSchema.safeParse({ name: 'a'.repeat(257), value: 'b' }).success,
    ).toBe(false);
    expect(
      embedFieldSchema.safeParse({ name: 'a', value: 'b'.repeat(1025) }).success,
    ).toBe(false);
  });
});

describe('embedSchema', () => {
  it('aceita embed completo válido', () => {
    const result = embedSchema.safeParse({
      title: 'Regras',
      description: 'Leia com atenção',
      url: 'https://delfus.app',
      timestamp: '2026-06-11T12:00:00.000Z',
      color: 0x5865f2,
      footer: { text: 'Delfus', icon_url: 'https://delfus.app/icon.png' },
      author: { name: 'Equipe', url: 'https://delfus.app' },
      image: { url: 'https://delfus.app/banner.png' },
      thumbnail: { url: '{{serverIcon}}' },
      fields: [{ name: 'Regra 1', value: 'Respeite todos', inline: true }],
    });
    expect(result.success).toBe(true);
  });

  it('rejeita embed totalmente vazio', () => {
    expect(embedSchema.safeParse({}).success).toBe(false);
  });

  it('rejeita estouro de limites (title 257, description 4097, 26 fields, cor > 0xFFFFFF)', () => {
    expect(embedSchema.safeParse({ title: 'a'.repeat(257) }).success).toBe(false);
    expect(embedSchema.safeParse({ description: 'a'.repeat(4097) }).success).toBe(false);
    const fields = Array.from({ length: 26 }, (_, i) => ({
      name: `f${i}`,
      value: 'v',
    }));
    expect(embedSchema.safeParse({ fields }).success).toBe(false);
    expect(embedSchema.safeParse({ title: 'x', color: 0x1000000 }).success).toBe(false);
    expect(embedSchema.safeParse({ title: 'x', color: -1 }).success).toBe(false);
  });

  it('rejeita timestamp que não é ISO 8601', () => {
    expect(embedSchema.safeParse({ title: 'x', timestamp: 'ontem' }).success).toBe(false);
  });
});

describe('embedTotalChars', () => {
  it('soma title, description, footer.text, author.name e fields', () => {
    const total = embedTotalChars({
      title: 'ab',                       // 2
      description: 'cde',                // 3
      footer: { text: 'fg' },            // 2
      author: { name: 'hij' },           // 3
      fields: [{ name: 'kl', value: 'mno' }], // 5
    });
    expect(total).toBe(15);
  });
});
