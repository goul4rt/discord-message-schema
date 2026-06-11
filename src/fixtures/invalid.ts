const bigEmbed = { description: 'a'.repeat(4000) };

export const INVALID_MESSAGES = [
  { name: 'mensagem vazia', message: {} },
  { name: 'content acima de 2000 chars', message: { content: 'a'.repeat(2001) } },
  {
    name: '11 embeds',
    message: { embeds: Array.from({ length: 11 }, (_, i) => ({ title: `e${i}` })) },
  },
  { name: 'embed vazio', message: { embeds: [{}] } },
  {
    name: 'field sem name',
    message: { embeds: [{ fields: [{ name: '', value: 'x' }] }] },
  },
  { name: 'cor fora do range', message: { embeds: [{ title: 'x', color: 0x1000000 }] } },
  { name: 'total de embeds acima de 6000 chars', message: { embeds: [bigEmbed, bigEmbed] } },
  {
    name: 'botão de ação (style 1) na v1',
    message: {
      components: [
        { type: 1, components: [{ type: 2, style: 1, label: 'x', custom_id: 'id' }] },
      ],
    },
  },
  {
    name: 'select menu na v1',
    message: {
      components: [
        {
          type: 1,
          components: [{ type: 3, custom_id: 'sel', options: [{ label: 'A', value: 'a' }] }],
        },
      ],
    },
  },
  { name: 'username proibido', message: { content: 'x', username: 'Discord Bot' } },
  { name: 'url inválida em image', message: { embeds: [{ image: { url: 'nope' } }] } },
  { name: 'title vazio com outro campo presente', message: { embeds: [{ title: '', description: 'x' }] } },
  {
    name: 'url com protocolo proibido mascarado por placeholder',
    message: { embeds: [{ image: { url: 'javascript:alert(1){{serverIcon}}' } }] },
  },
  {
    name: 'allowed_mentions parse users + lista users explícita',
    message: {
      content: 'x',
      allowed_mentions: { parse: ['users'], users: ['123456789012345678'] },
    },
  },
] as const;

export const INVALID_SEND_REQUESTS = [
  {
    name: 'username no modo bot',
    request: {
      mode: 'bot',
      channelId: '123456789012345678',
      data: { content: 'x', username: 'Delfus News' },
    },
  },
  {
    name: 'channelId que não é snowflake',
    request: { mode: 'bot', channelId: 'geral', data: { content: 'x' } },
  },
  {
    name: 'data inválido (mensagem vazia)',
    request: { mode: 'bot', channelId: '123456789012345678', data: {} },
  },
  {
    name: 'edição webhook sem webhookId',
    request: {
      mode: 'webhook',
      channelId: '123456789012345678',
      messageId: '876543210987654321',
      data: { content: 'editado' },
    },
  },
] as const;
