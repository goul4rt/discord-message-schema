import { describe, expect, it } from 'vitest';
import {
  ERROR_CODES,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
  snowflakeSchema,
} from '../src/wire';

describe('snowflakeSchema', () => {
  it('aceita snowflakes de 17 a 20 dígitos e rejeita o resto', () => {
    expect(snowflakeSchema.safeParse('12345678901234567').success).toBe(true);
    expect(snowflakeSchema.safeParse('1234567890123456').success).toBe(false);
    expect(snowflakeSchema.safeParse('abc').success).toBe(false);
  });
});

describe('ERROR_CODES', () => {
  it('contém os códigos do contrato', () => {
    expect(ERROR_CODES).toEqual([
      'INVALID_PAYLOAD',
      'CHANNEL_NOT_FOUND',
      'MISSING_PERMISSIONS',
      'MESSAGE_DELETED',
      'WEBHOOK_CREATE_FAILED',
      'DISCORD_API_ERROR',
    ]);
  });
});

describe('sendMessageRequestSchema', () => {
  const channelId = '123456789012345678';

  it('aceita envio modo bot', () => {
    const result = sendMessageRequestSchema.safeParse({
      mode: 'bot',
      channelId,
      data: { content: 'oi' },
    });
    expect(result.success).toBe(true);
  });

  it('aceita envio modo webhook com username/avatar e edição com messageId + webhookId', () => {
    expect(
      sendMessageRequestSchema.safeParse({
        mode: 'webhook',
        channelId,
        data: { content: 'oi', username: 'Delfus News', avatar_url: 'https://x.com/a.png' },
      }).success,
    ).toBe(true);
    expect(
      sendMessageRequestSchema.safeParse({
        mode: 'webhook',
        channelId,
        messageId: '123456789012345678',
        webhookId: '123456789012345678',
        data: { content: 'editado' },
      }).success,
    ).toBe(true);
  });

  it('rejeita username/avatar_url no modo bot', () => {
    const result = sendMessageRequestSchema.safeParse({
      mode: 'bot',
      channelId,
      data: { content: 'oi', username: 'Delfus News' },
    });
    expect(result.success).toBe(false);
  });

  it('rejeita payload de mensagem inválido (propaga validação do messageSchema)', () => {
    expect(
      sendMessageRequestSchema.safeParse({ mode: 'bot', channelId, data: {} }).success,
    ).toBe(false);
  });
});

describe('sendMessageResponseSchema', () => {
  it('aceita sucesso e erro estruturado', () => {
    expect(
      sendMessageResponseSchema.safeParse({
        ok: true,
        messageId: '123456789012345678',
        channelId: '123456789012345678',
      }).success,
    ).toBe(true);
    expect(
      sendMessageResponseSchema.safeParse({
        ok: false,
        error: { code: 'MISSING_PERMISSIONS', message: 'Bot lacks SendMessages' },
      }).success,
    ).toBe(true);
    expect(
      sendMessageResponseSchema.safeParse({
        ok: false,
        error: { code: 'NOPE', message: 'x' },
      }).success,
    ).toBe(false);
  });
});
