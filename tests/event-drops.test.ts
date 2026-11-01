import { describe, expect, it } from 'vitest';
import { eventDropsConfigSchema } from '../src/schema/event-drops';
import {
  EVENT_DROPS_HALLOWEEN_2026,
  EVENT_DROPS_HALLOWEEN_2026_PARSED,
  EVENT_DROPS_INVALID,
} from '../src/fixtures/event-drops';

describe('eventDropsConfigSchema', () => {
  it('parse(Halloween) == PARSED (defaults aplicados)', () => {
    expect(eventDropsConfigSchema.parse(EVENT_DROPS_HALLOWEEN_2026)).toEqual(
      EVENT_DROPS_HALLOWEEN_2026_PARSED,
    );
  });

  it('parse é idempotente', () => {
    expect(eventDropsConfigSchema.parse(EVENT_DROPS_HALLOWEEN_2026_PARSED)).toEqual(
      EVENT_DROPS_HALLOWEEN_2026_PARSED,
    );
  });

  for (const { name, config, expectPath } of EVENT_DROPS_INVALID) {
    it(`rejeita: ${name}`, () => {
      const r = eventDropsConfigSchema.safeParse(config);
      expect(r.success).toBe(false);
      if (!r.success) expect(r.error.issues.map(i => i.path)).toContainEqual(expectPath);
    });
  }

  it('mensagens dos refines permanecem as originais', () => {
    const msg = (name: string) => {
      const c = EVENT_DROPS_INVALID.find(x => x.name === name)!;
      const r = eventDropsConfigSchema.safeParse(c.config);
      return r.success ? [] : r.error.issues.map(i => i.message);
    };
    expect(msg('escolha sem options')).toContain('iara: options obrigatório');
    expect(msg('distribution não soma options.length')).toContain(
      'iara: distribution deve somar options.length',
    );
    expect(msg('digitar sem answers')).toContain('saci: answers obrigatório');
    expect(msg('drop.key duplicado')).toContain('drop.key duplicado');
    expect(msg('schedule com drop_key inexistente')).toContain(
      'schedule: drop_key nao-existe inexistente',
    );
  });
});
