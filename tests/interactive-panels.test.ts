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

  it('rejeita árvore com mais de 10 componentes de topo', () => {
    const tree = Array.from({ length: 11 }, () => ({ type: 10, content: 'x' }));
    expect(interactivePanelSchema.safeParse({ ...base, componentsV2: tree }).success).toBe(false);
    expect(
      interactivePanelSchema.safeParse({ ...base, componentsV2: tree.slice(0, 10) }).success
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
