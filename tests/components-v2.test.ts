import { describe, expect, it } from 'vitest';
import { LIMITS } from '../src/limits';
import {
  componentsV2TotalChars,
  containerSchema,
  sectionSchema,
  textDisplaySchema,
} from '../src/schema/components-v2';
import { messageSchema } from '../src/schema/message';

const text = (content: string) => ({ type: 10 as const, content });
const V2 = LIMITS.FLAG_COMPONENTS_V2;

describe('components v2 — nós', () => {
  it('text display exige conteúdo', () => {
    expect(textDisplaySchema.safeParse(text('oi')).success).toBe(true);
    expect(textDisplaySchema.safeParse(text('')).success).toBe(false);
  });

  it('container aceita filhos de tipos distintos e cor de destaque', () => {
    const result = containerSchema.safeParse({
      type: 17,
      accent_color: 0x5865f2,
      components: [text('# Ranking'), { type: 14, divider: true }, text('1. Casa Stark')],
    });
    expect(result.success).toBe(true);
  });

  it('container rejeita container aninhado (um nível só)', () => {
    const result = containerSchema.safeParse({
      type: 17,
      components: [{ type: 17, components: [text('oi')] }],
    });
    expect(result.success).toBe(false);
  });

  it('container respeita o teto de filhos', () => {
    const many = Array.from({ length: LIMITS.V2_CONTAINER_CHILDREN_MAX + 1 }, (_, i) =>
      text(`linha ${i}`),
    );
    expect(containerSchema.safeParse({ type: 17, components: many }).success).toBe(false);
  });

  it('section exige acessório', () => {
    expect(
      sectionSchema.safeParse({ type: 9, components: [text('oi')] }).success,
    ).toBe(false);
    expect(
      sectionSchema.safeParse({
        type: 9,
        components: [text('oi')],
        accessory: { type: 11, media: { url: 'https://exemplo.com/a.png' } },
      }).success,
    ).toBe(true);
  });
});

describe('componentsV2TotalChars', () => {
  it('soma text displays soltos, dentro de section e dentro de container', () => {
    const total = componentsV2TotalChars([
      text('12345'),
      {
        type: 17,
        components: [
          text('123'),
          {
            type: 9,
            components: [text('12')],
            accessory: { type: 11, media: { url: 'https://exemplo.com/a.png' } },
          },
        ],
      },
    ]);
    expect(total).toBe(10);
  });
});

describe('messageSchema — exclusividade V1/V2', () => {
  it('com a flag V2, aceita componentes e rejeita content/embeds', () => {
    expect(
      messageSchema.safeParse({ flags: V2, components: [{ type: 17, components: [text('oi')] }] })
        .success,
    ).toBe(true);

    const withContent = messageSchema.safeParse({
      flags: V2,
      content: 'nao pode',
      components: [{ type: 17, components: [text('oi')] }],
    });
    expect(withContent.success).toBe(false);

    const withEmbed = messageSchema.safeParse({
      flags: V2,
      embeds: [{ title: 'nao pode' }],
      components: [{ type: 17, components: [text('oi')] }],
    });
    expect(withEmbed.success).toBe(false);
  });

  it('com a flag V2, exige pelo menos um componente', () => {
    expect(messageSchema.safeParse({ flags: V2, components: [] }).success).toBe(false);
  });

  it('sem a flag, rejeita componentes V2', () => {
    const result = messageSchema.safeParse({
      components: [{ type: 17, components: [text('oi')] }],
    });
    expect(result.success).toBe(false);
  });

  it('sem a flag, o contrato V1 segue igual', () => {
    expect(messageSchema.safeParse({ content: 'oi' }).success).toBe(true);
    expect(messageSchema.safeParse({}).success).toBe(false);
  });

  it('reprova estouro do teto agregado de caracteres', () => {
    const huge = 'x'.repeat(LIMITS.V2_TOTAL_CHARS_MAX + 1);
    const result = messageSchema.safeParse({
      flags: V2,
      components: [{ type: 17, components: [text(huge)] }],
    });
    expect(result.success).toBe(false);
  });
});
