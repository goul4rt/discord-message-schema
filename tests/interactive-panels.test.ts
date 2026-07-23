import { describe, expect, it } from 'vitest';
import {
  interactivePanelsConfigSchema,
  panelActionSchema,
  interactivePanelSchema,
} from '../src/schema/interactive-panels';
import { embedSchema } from '../src/schema/embed';

const ROLE = '123456789012345678';

describe('panelActionSchema', () => {
  it('aceita reply_text, role e saved_msg', () => {
    expect(panelActionSchema.safeParse({ kind: 'reply_text', text: 'oi', ephemeral: true }).success).toBe(true);
    expect(panelActionSchema.safeParse({ kind: 'role', roleId: ROLE, mode: 'toggle' }).success).toBe(true);
    expect(panelActionSchema.safeParse({ kind: 'saved_msg', customResponseId: 'abc', ephemeral: false }).success).toBe(true);
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
