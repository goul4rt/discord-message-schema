import { describe, expect, it } from 'vitest';
import { messageSchema } from '../src/schema/message';

const link = { type: 2 as const, style: 5 as const, label: 'Site', url: 'https://delfus.app' };

describe('messageSchema', () => {
  it('aceita mensagem só com content', () => {
    expect(messageSchema.safeParse({ content: 'oi' }).success).toBe(true);
  });

  it('aceita mensagem só com embed, e só com components', () => {
    expect(
      messageSchema.safeParse({ embeds: [{ title: 'x' }] }).success,
    ).toBe(true);
    expect(
      messageSchema.safeParse({ components: [{ type: 1, components: [link] }] }).success,
    ).toBe(true);
  });

  it('rejeita mensagem vazia (sem content, embeds ou components)', () => {
    expect(messageSchema.safeParse({}).success).toBe(false);
    expect(messageSchema.safeParse({ content: '' }).success).toBe(false);
  });

  it('rejeita content > 2000, 11 embeds e 6 action rows', () => {
    expect(messageSchema.safeParse({ content: 'a'.repeat(2001) }).success).toBe(false);
    const embeds = Array.from({ length: 11 }, (_, i) => ({ title: `e${i}` }));
    expect(messageSchema.safeParse({ embeds }).success).toBe(false);
    const rows = Array.from({ length: 6 }, () => ({ type: 1, components: [link] }));
    expect(messageSchema.safeParse({ content: 'x', components: rows }).success).toBe(false);
  });

  it('rejeita total de caracteres dos embeds > 6000', () => {
    const big = { description: 'a'.repeat(4000) };
    expect(messageSchema.safeParse({ embeds: [big, big] }).success).toBe(false);
    expect(messageSchema.safeParse({ embeds: [big] }).success).toBe(true);
  });

  it('valida username: máx 80 e nomes proibidos', () => {
    expect(messageSchema.safeParse({ content: 'x', username: 'Delfus News' }).success).toBe(true);
    expect(
      messageSchema.safeParse({ content: 'x', username: 'a'.repeat(81) }).success,
    ).toBe(false);
    for (const bad of ['clyde', 'Discord Notícias', 'everyone', 'here']) {
      expect(messageSchema.safeParse({ content: 'x', username: bad }).success).toBe(false);
    }
  });

  it('valida allowed_mentions', () => {
    const ok = messageSchema.safeParse({
      content: 'x',
      allowed_mentions: { parse: ['users'], roles: ['123456789012345678'] },
    });
    expect(ok.success).toBe(true);
    expect(
      messageSchema.safeParse({ content: 'x', allowed_mentions: { parse: ['bots'] } }).success,
    ).toBe(false);
  });

  it('rejeita parse users combinado com lista explícita de users', () => {
    expect(
      messageSchema.safeParse({
        content: 'x',
        allowed_mentions: { parse: ['users'], users: ['123456789012345678'] },
      }).success,
    ).toBe(false);
  });
});
