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

  it('rejeita protocolo proibido mascarado por placeholder e lixo após a URL', () => {
    expect(urlSchema.safeParse('javascript:alert(1){{serverIcon}}').success).toBe(false);
    expect(urlSchema.safeParse('data:text/html,{{server}}').success).toBe(false);
    expect(urlSchema.safeParse('https://x.com\ngarbage').success).toBe(false);
    expect(urlSchema.safeParse('https://x.com garbage').success).toBe(false);
  });

  it('aceita placeholder puro e https com placeholder no path', () => {
    expect(urlSchema.safeParse('{{serverIcon}}').success).toBe(true);
    expect(urlSchema.safeParse('https://cdn.x.com/{{server}}/icon.png').success).toBe(true);
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

  it('aceita valores exatamente no limite', () => {
    expect(embedSchema.safeParse({ title: 'a'.repeat(256) }).success).toBe(true);
    expect(embedSchema.safeParse({ title: 'x', description: 'b'.repeat(4096) }).success).toBe(true);
    expect(embedSchema.safeParse({ title: 'x', color: 0 }).success).toBe(true);
    expect(embedSchema.safeParse({ title: 'x', color: 0xffffff }).success).toBe(true);
    const fields25 = Array.from({ length: 25 }, (_, i) => ({ name: `f${i}`, value: 'v' }));
    expect(embedSchema.safeParse({ fields: fields25 }).success).toBe(true);
  });

  it('rejeita title e description vazios quando presentes', () => {
    expect(embedSchema.safeParse({ title: '', description: 'x' }).success).toBe(false);
    expect(embedSchema.safeParse({ title: 'x', description: '' }).success).toBe(false);
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
