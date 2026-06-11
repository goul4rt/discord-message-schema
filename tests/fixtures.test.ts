import { describe, expect, it } from 'vitest';
import { messageSchema } from '../src/schema/message';
import { sendMessageRequestSchema } from '../src/wire';
import {
  VALID_MESSAGES,
  VALID_SEND_REQUESTS,
} from '../src/fixtures/valid';
import {
  INVALID_MESSAGES,
  INVALID_SEND_REQUESTS,
} from '../src/fixtures/invalid';

describe('fixtures válidas', () => {
  for (const fixture of VALID_MESSAGES) {
    it(`messageSchema aceita: ${fixture.name}`, () => {
      const result = messageSchema.safeParse(fixture.message);
      expect(result.success, JSON.stringify(result)).toBe(true);
    });
  }
  for (const fixture of VALID_SEND_REQUESTS) {
    it(`sendMessageRequestSchema aceita: ${fixture.name}`, () => {
      const result = sendMessageRequestSchema.safeParse(fixture.request);
      expect(result.success, JSON.stringify(result)).toBe(true);
    });
  }
});

describe('fixtures inválidas', () => {
  for (const fixture of INVALID_MESSAGES) {
    it(`messageSchema rejeita: ${fixture.name}`, () => {
      expect(messageSchema.safeParse(fixture.message).success).toBe(false);
    });
  }
  for (const fixture of INVALID_SEND_REQUESTS) {
    it(`sendMessageRequestSchema rejeita: ${fixture.name}`, () => {
      expect(sendMessageRequestSchema.safeParse(fixture.request).success).toBe(false);
    });
  }
});
