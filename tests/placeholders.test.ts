import { describe, expect, it } from 'vitest';
import {
  PLACEHOLDERS,
  containsPlaceholder,
  resolvePlaceholders,
} from '../src/placeholders';

describe('PLACEHOLDERS', () => {
  it('define server, memberCount e serverIcon com exemplo', () => {
    const keys = PLACEHOLDERS.map((p) => p.key);
    expect(keys).toEqual(['server', 'memberCount', 'serverIcon']);
    for (const p of PLACEHOLDERS) {
      expect(p.token).toBe(`{{${p.key}}}`);
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.example.length).toBeGreaterThan(0);
    }
  });
});

describe('containsPlaceholder', () => {
  it('detecta {{server}} e {{ memberCount }} (com espaços)', () => {
    expect(containsPlaceholder('Bem-vindo ao {{server}}!')).toBe(true);
    expect(containsPlaceholder('Somos {{ memberCount }} membros')).toBe(true);
  });

  it('não detecta texto sem placeholder nem chaves vazias', () => {
    expect(containsPlaceholder('sem nada')).toBe(false);
    expect(containsPlaceholder('isto {{}} não vale')).toBe(false);
  });

  it('é stateless (sem flag global vazando estado entre chamadas)', () => {
    expect(containsPlaceholder('{{server}}')).toBe(true);
    expect(containsPlaceholder('{{server}}')).toBe(true);
  });
});

describe('resolvePlaceholders', () => {
  const values = { server: 'Delfus', memberCount: '1234' };

  it('resolve placeholders em string', () => {
    expect(resolvePlaceholders('Oi {{server}}, {{memberCount}} membros', values)).toBe(
      'Oi Delfus, 1234 membros',
    );
  });

  it('mantém placeholder desconhecido intacto', () => {
    expect(resolvePlaceholders('{{desconhecido}}', values)).toBe('{{desconhecido}}');
  });

  it('resolve profundamente em objetos e arrays sem mutar o original', () => {
    const input = {
      content: 'Oi {{server}}',
      embeds: [{ title: '{{memberCount}} membros', color: 5793266 }],
    };
    const out = resolvePlaceholders(input, values);
    expect(out).toEqual({
      content: 'Oi Delfus',
      embeds: [{ title: '1234 membros', color: 5793266 }],
    });
    expect(input.content).toBe('Oi {{server}}');
    expect(input.embeds[0]?.title).toBe('{{memberCount}} membros');
  });

  it('passa primitivos não-string e instâncias de classe intactos', () => {
    expect(resolvePlaceholders({ color: 5793266, flag: true, n: null }, values)).toEqual({
      color: 5793266,
      flag: true,
      n: null,
    });
    const date = new Date(0);
    expect(resolvePlaceholders(date, values)).toBe(date);
  });
});
