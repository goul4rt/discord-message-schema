import { describe, expect, it } from 'vitest';
import {
  interactivePanelsConfigSchema,
  panelActionSchema,
  interactivePanelSchema,
  panelGateSchema,
} from '../src/schema/interactive-panels';
import { embedSchema } from '../src/schema/embed';

const ROLE = '123456789012345678';

describe('panelActionSchema', () => {
  it('aceita reply_text, role, saved_msg e saved_message', () => {
    expect(panelActionSchema.safeParse({ kind: 'reply_text', text: 'oi', ephemeral: true }).success).toBe(true);
    expect(panelActionSchema.safeParse({ kind: 'role', roleId: ROLE, mode: 'toggle' }).success).toBe(true);
    expect(panelActionSchema.safeParse({ kind: 'saved_msg', customResponseId: 'abc', ephemeral: false }).success).toBe(true);
    expect(panelActionSchema.safeParse({ kind: 'saved_message', savedMessageId: 'sm1', ephemeral: true }).success).toBe(true);
  });
  it('ticket_open: exige categoryId (id da categoria de tickets, até 40)', () => {
    expect(panelActionSchema.parse({ kind: 'ticket_open', categoryId: 'denuncia' })).toEqual({
      kind: 'ticket_open',
      categoryId: 'denuncia',
    });
    expect(panelActionSchema.safeParse({ kind: 'ticket_open' }).success).toBe(false);
    expect(panelActionSchema.safeParse({ kind: 'ticket_open', categoryId: '' }).success).toBe(false);
    expect(panelActionSchema.safeParse({ kind: 'ticket_open', categoryId: 'x'.repeat(41) }).success).toBe(false);
  });

  it('saved_message: ephemeral defaulta pra true e exige savedMessageId', () => {
    const parsed = panelActionSchema.parse({ kind: 'saved_message', savedMessageId: 'sm1' });
    expect(parsed).toEqual({ kind: 'saved_message', savedMessageId: 'sm1', ephemeral: true });
    expect(panelActionSchema.safeParse({ kind: 'saved_message', savedMessageId: '' }).success).toBe(false);
  });
  it('rejeita kind desconhecido', () => {
    expect(panelActionSchema.safeParse({ kind: 'ban', userId: '1' }).success).toBe(false);
  });
});

describe('interactivePanelsConfigSchema', () => {
  it('aceita um painel com botão + gate', () => {
    const ok = interactivePanelsConfigSchema.safeParse({
      enabled: true,
      panels: [
        {
          id: 'p1',
          name: 'Painel',
          enabled: true,
          channelId: ROLE,
          components: [
            {
              id: 'b1',
              type: 'button',
              label: 'Pegar cargo',
              style: 'primary',
              gate: { allowedRoleIds: [ROLE], denyMessage: 'Sem acesso' },
              action: { kind: 'role', roleId: ROLE, mode: 'toggle' },
            },
          ],
        },
      ],
    });
    expect(ok.success).toBe(true);
  });
  it('gate aceita só a tag do servidor e rejeita gate vazio', () => {
    expect(panelGateSchema.safeParse({ requireServerTag: true }).success).toBe(true);
    expect(panelGateSchema.safeParse({ allowedRoleIds: [] }).success).toBe(false);
    expect(panelGateSchema.safeParse({ requireServerTag: false }).success).toBe(false);
  });
  it('gate aceita DM de perda de tag (texto ou mensagem salva)', () => {
    expect(panelGateSchema.safeParse({ requireServerTag: true, tagLossDm: { kind: 'text', text: 'Volte!' } }).success).toBe(true);
    expect(panelGateSchema.safeParse({ requireServerTag: true, tagLossDm: { kind: 'saved_message', savedMessageId: 'm1' } }).success).toBe(true);
    expect(panelGateSchema.safeParse({ requireServerTag: true, tagLossDm: { kind: 'text', text: '' } }).success).toBe(false);
  });
  it('rejeita botão sem ação', () => {
    const bad = interactivePanelsConfigSchema.safeParse({
      enabled: true,
      panels: [{ id: 'p', name: 'x', enabled: true, channelId: ROLE, components: [{ id: 'b', type: 'button', label: 'x' }] }],
    });
    expect(bad.success).toBe(false);
  });
  it('default de enabled e defaults de ação aplicam', () => {
    const parsed = interactivePanelsConfigSchema.parse({});
    expect(parsed.enabled).toBe(false);
    expect(parsed.panels).toEqual([]);
  });
});

describe('interactivePanelSchema com embed', () => {
  it('aceita um painel com embed no corpo', () => {
    const panel = {
      id: 'p1',
      name: 'X',
      enabled: true,
      channelId: ROLE,
      components: [{ id: 'b1', type: 'button', label: 'Ok', action: { kind: 'reply_text', text: 'oi' } }],
      embed: { title: 'Olá', description: 'corpo' },
    };
    const result = interactivePanelSchema.safeParse(panel);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.embed).toBeDefined();
      expect(result.data.embed?.title).toBe('Olá');
    }
  });

  it('painel sem embed continua válido (backward-compat)', () => {
    const panel = {
      id: 'p1',
      name: 'X',
      enabled: true,
      channelId: ROLE,
      components: [{ id: 'b1', type: 'button', label: 'Ok', action: { kind: 'reply_text', text: 'oi' } }],
    };
    const result = interactivePanelSchema.safeParse(panel);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.embed).toBeUndefined();
    }
  });
});

describe('interactivePanelSchema com componentsV2 (corpo V2)', () => {
  const base = {
    id: 'p1',
    name: 'X',
    enabled: true,
    channelId: ROLE,
    components: [{ id: 'b1', type: 'button', label: 'Ok', action: { kind: 'reply_text', text: 'oi' } }],
  };
  const v2Body = [{ type: 10, content: 'corpo em blocos' }];

  it('aceita um painel com componentsV2 no corpo', () => {
    const result = interactivePanelSchema.safeParse({ ...base, componentsV2: v2Body });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.componentsV2).toHaveLength(1);
  });

  it('embed e componentsV2 são mutuamente exclusivos', () => {
    const result = interactivePanelSchema.safeParse({
      ...base,
      embed: { title: 'Olá' },
      componentsV2: v2Body,
    });
    expect(result.success).toBe(false);
  });

  it('componentsV2 não aceita content (Discord rejeita content com a flag V2)', () => {
    const result = interactivePanelSchema.safeParse({
      ...base,
      content: 'texto',
      componentsV2: v2Body,
    });
    expect(result.success).toBe(false);
  });

  it('painel sem componentsV2 continua válido (backward-compat), inclusive com embed+content', () => {
    expect(interactivePanelSchema.safeParse({ ...base, content: 'oi', embed: { title: 'T' } }).success).toBe(true);
  });

  it('componentsV2 vazio é rejeitado (usar undefined para modo clássico)', () => {
    expect(interactivePanelSchema.safeParse({ ...base, componentsV2: [] }).success).toBe(false);
  });
});

describe('limites do componentsV2 no painel (0.6.1)', () => {
  const base = {
    id: 'p1',
    name: 'X',
    enabled: true,
    channelId: ROLE,
    components: [{ id: 'b1', type: 'button', label: 'Ok', action: { kind: 'reply_text', text: 'oi' } }],
  };

  it('aceita mais de 10 blocos de topo e para no teto de 40 com as automações (0.11)', () => {
    // 1 botão = 1 linha + 1 botão → sobram 38 blocos.
    const tree = Array.from({ length: 39 }, () => ({ type: 10, content: 'x' }));
    expect(interactivePanelSchema.safeParse({ ...base, componentsV2: tree }).success).toBe(false);
    expect(
      interactivePanelSchema.safeParse({ ...base, componentsV2: tree.slice(0, 38) }).success
    ).toBe(true);
  });

  it('rejeita árvore acima do teto AGREGADO de caracteres do V2', () => {
    // Cada nó passa no limite individual (4000), mas a soma estoura o teto
    // total da mensagem V2.
    const big = [
      { type: 10, content: 'a'.repeat(2500) },
      { type: 10, content: 'b'.repeat(2500) },
    ];
    expect(interactivePanelSchema.safeParse({ ...base, componentsV2: big }).success).toBe(false);
  });
});

describe('vários embeds no painel (0.10.0)', () => {
  const base = {
    id: 'p1',
    name: 'X',
    enabled: true,
    channelId: ROLE,
    components: [{ id: 'b1', type: 'button', label: 'Ok', action: { kind: 'reply_text', text: 'oi' } }],
  };

  it('aceita até 10 embeds e rejeita 11', () => {
    const e = (i: number) => ({ title: `E${i}` });
    const ten = Array.from({ length: 10 }, (_, i) => e(i));
    expect(interactivePanelSchema.safeParse({ ...base, embeds: ten }).success).toBe(true);
    expect(interactivePanelSchema.safeParse({ ...base, embeds: [...ten, e(10)] }).success).toBe(false);
  });

  it('rejeita embed e embeds juntos', () => {
    expect(
      interactivePanelSchema.safeParse({ ...base, embed: { title: 'a' }, embeds: [{ title: 'b' }] }).success
    ).toBe(false);
  });

  it('rejeita embeds que somados passam de 6000 caracteres', () => {
    const big = { description: 'x'.repeat(3500) };
    expect(interactivePanelSchema.safeParse({ ...base, embeds: [big, big] }).success).toBe(false);
  });

  it('embeds e componentsV2 são mutuamente exclusivos', () => {
    expect(
      interactivePanelSchema.safeParse({
        ...base,
        embeds: [{ title: 'a' }],
        componentsV2: [{ type: 10, content: 'x' }],
      }).success
    ).toBe(false);
  });
});
