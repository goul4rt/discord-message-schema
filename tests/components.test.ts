import { describe, expect, it } from 'vitest';
import {
  actionRowSchema,
  emojiSchema,
  linkButtonSchema,
} from '../src/schema/components';

describe('emojiSchema', () => {
  it('aceita emoji unicode (name) e custom (id)', () => {
    expect(emojiSchema.safeParse({ name: '🔥' }).success).toBe(true);
    expect(
      emojiSchema.safeParse({ id: '123456789012345678', name: 'delfus', animated: false })
        .success,
    ).toBe(true);
  });

  it('rejeita emoji sem name e sem id', () => {
    expect(emojiSchema.safeParse({}).success).toBe(false);
  });
});

describe('linkButtonSchema', () => {
  it('aceita botão de link com label', () => {
    const result = linkButtonSchema.safeParse({
      type: 2,
      style: 5,
      label: 'Site',
      url: 'https://delfus.app',
    });
    expect(result.success).toBe(true);
  });

  it('aceita botão só com emoji (sem label)', () => {
    const result = linkButtonSchema.safeParse({
      type: 2,
      style: 5,
      emoji: { name: '🔥' },
      url: 'https://delfus.app',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita botão sem label e sem emoji, sem url, e label > 80', () => {
    expect(
      linkButtonSchema.safeParse({ type: 2, style: 5, url: 'https://x.com' }).success,
    ).toBe(false);
    expect(
      linkButtonSchema.safeParse({ type: 2, style: 5, label: 'a' }).success,
    ).toBe(false);
    expect(
      linkButtonSchema.safeParse({
        type: 2,
        style: 5,
        label: 'a'.repeat(81),
        url: 'https://x.com',
      }).success,
    ).toBe(false);
  });
});

describe('actionRowSchema (v1: só botões de link)', () => {
  const link = { type: 2, style: 5, label: 'Site', url: 'https://delfus.app' };

  it('aceita row com 1 a 5 botões de link', () => {
    expect(actionRowSchema.safeParse({ type: 1, components: [link] }).success).toBe(true);
    expect(
      actionRowSchema.safeParse({ type: 1, components: Array(5).fill(link) }).success,
    ).toBe(true);
  });

  it('rejeita row vazia e row com 6 componentes', () => {
    expect(actionRowSchema.safeParse({ type: 1, components: [] }).success).toBe(false);
    expect(
      actionRowSchema.safeParse({ type: 1, components: Array(6).fill(link) }).success,
    ).toBe(false);
  });

  it('rejeita botão de ação (style 1) na v1, apontando o path do componente', () => {
    const result = actionRowSchema.safeParse({
      type: 1,
      components: [{ type: 2, style: 1, label: 'Clique', custom_id: 'x' }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const v1Issue = result.error.issues.find((i) =>
        i.message.includes('v1'),
      );
      expect(v1Issue?.path).toEqual(['components', 0]);
    }
  });

  it('rejeita select menu na v1', () => {
    const result = actionRowSchema.safeParse({
      type: 1,
      components: [
        {
          type: 3,
          custom_id: 'sel',
          options: [{ label: 'A', value: 'a' }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
