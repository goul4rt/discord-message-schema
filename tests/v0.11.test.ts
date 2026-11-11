import { describe, expect, it } from 'vitest';
import {
  LIMITS,
  countComponentsV2,
  countPanelAutomationComponents,
  interactivePanelSchema,
  messageSchema,
  panelSelectSchema,
  resolvePlaceholders,
  discordTimestamp,
  sectionSchema,
} from '../src';

const txt = (i: number) => ({ type: 10 as const, content: `t${i}` });
const texts = (n: number) => Array.from({ length: n }, (_, i) => txt(i));
const v2 = (components: unknown[]) => ({ flags: LIMITS.FLAG_COMPONENTS_V2, components });

// Números conferidos na API do Discord em 11/11/2026 com o bot de teste.
describe('teto de 40 componentes do V2', () => {
  it('aceita 40 textos na raiz e recusa 41', () => {
    expect(messageSchema.safeParse(v2(texts(40))).success).toBe(true);
    expect(messageSchema.safeParse(v2(texts(41))).success).toBe(false);
  });

  it('container com 39 filhos fecha 40; com 40 passa do teto', () => {
    expect(messageSchema.safeParse(v2([{ type: 17, components: texts(39) }])).success).toBe(true);
    expect(messageSchema.safeParse(v2([{ type: 17, components: texts(40) }])).success).toBe(false);
  });

  it('conta acessório da section e botões das linhas, não itens de galeria', () => {
    const section = {
      type: 9,
      components: texts(2),
      accessory: { type: 2, style: 5, label: 'x', url: 'https://delfus.app' },
    };
    expect(countComponentsV2([section])).toBe(4);
    const gallery = {
      type: 12,
      items: Array.from({ length: 10 }, () => ({ media: { url: 'https://delfus.app/a.png' } })),
    };
    expect(countComponentsV2([gallery])).toBe(1);
    const row = {
      type: 1,
      components: Array.from({ length: 5 }, () => ({ type: 2, style: 5, label: 'b', url: 'https://delfus.app' })),
    };
    expect(countComponentsV2([row])).toBe(6);
  });

  it('section aceita até 3 textos', () => {
    const accessory = { type: 2, style: 5, label: 'x', url: 'https://delfus.app' };
    expect(sectionSchema.safeParse({ type: 9, components: texts(3), accessory }).success).toBe(true);
    expect(sectionSchema.safeParse({ type: 9, components: texts(4), accessory }).success).toBe(false);
  });
});

describe('painel V2 soma blocos e automações', () => {
  const button = (id: string) => ({
    id,
    type: 'button' as const,
    label: id,
    action: { kind: 'reply_text' as const, text: 'oi' },
  });
  const base = { id: 'p', name: 'p', channelId: '123456789012345678' };

  it('6 botões = 2 linhas + 6 = 8 componentes', () => {
    expect(countPanelAutomationComponents(Array.from({ length: 6 }, (_, i) => button(`b${i}`)))).toBe(8);
  });

  it('recusa painel cujos blocos + automações passam de 40', () => {
    const components = [button('a')]; // 1 linha + 1 botão = 2
    expect(
      interactivePanelSchema.safeParse({ ...base, componentsV2: texts(38), components }).success,
    ).toBe(true);
    expect(
      interactivePanelSchema.safeParse({ ...base, componentsV2: texts(39), components }).success,
    ).toBe(false);
  });
});

describe('clearAfterUse no menu do painel', () => {
  const select = {
    id: 's',
    type: 'select',
    options: [{ id: 'o', label: 'A', action: { kind: 'reply_text', text: 'oi' } }],
  };
  it('é opcional e preserva false', () => {
    expect(panelSelectSchema.parse(select).clearAfterUse).toBeUndefined();
    expect(panelSelectSchema.parse({ ...select, clearAfterUse: false }).clearAfterUse).toBe(false);
  });
});

describe('variáveis de data/hora', () => {
  it('resolve {{now}} e companhia sem o chamador passar valor', () => {
    const out = resolvePlaceholders('{{now}}|{{nowDate}}|{{nowTime}}|{{nowRelative}}', {});
    expect(out).toMatch(/^<t:\d+:f>\|<t:\d+:D>\|<t:\d+:t>\|<t:\d+:R>$/);
    const sec = Number(/<t:(\d+):f>/.exec(out)![1]);
    expect(Math.abs(sec - Date.now() / 1000)).toBeLessThan(5);
  });

  it('valor passado pelo chamador vence', () => {
    expect(resolvePlaceholders('{{now}}', { now: 'X' })).toBe('X');
  });

  it('discordTimestamp aceita Date ou segundos', () => {
    expect(discordTimestamp(new Date(1794407400 * 1000), 'F')).toBe('<t:1794407400:F>');
    expect(discordTimestamp(1794407400)).toBe('<t:1794407400:f>');
  });
});
