/**
 * Contract fixtures: both consumer repos run these through the schemas in
 * their own test suites to detect version drift.
 */
export const VALID_MESSAGES = [
  {
    name: 'mensagem mínima (só content)',
    message: { content: 'Olá, mundo!' },
  },
  {
    name: 'mensagem completa (content + 2 embeds + botões de link + mentions)',
    message: {
      content: 'Confira as novidades do {{server}}!',
      embeds: [
        {
          title: 'Regras do servidor',
          description: 'Leia **com atenção** antes de participar.',
          url: 'https://delfus.app/regras',
          color: 0x5865f2,
          timestamp: '2026-06-11T12:00:00.000Z',
          author: { name: 'Equipe Delfus', icon_url: '{{serverIcon}}' },
          footer: { text: 'Atualizado em junho de 2026' },
          thumbnail: { url: '{{serverIcon}}' },
          fields: [
            { name: 'Respeito', value: 'Trate todos bem.', inline: true },
            { name: 'Spam', value: 'Proibido flood.', inline: true },
          ],
        },
        {
          description: 'Somos {{memberCount}} membros!',
          image: { url: 'https://delfus.app/banner.png' },
          color: 0x57f287,
        },
      ],
      components: [
        {
          type: 1,
          components: [
            { type: 2, style: 5, label: 'Site', url: 'https://delfus.app' },
            { type: 2, style: 5, emoji: { name: '📖' }, url: 'https://delfus.app/docs' },
          ],
        },
      ],
      allowed_mentions: { parse: ['users'] },
    },
  },
  {
    name: 'mensagem de webhook (username + avatar customizados)',
    message: {
      content: 'Anúncio oficial!',
      username: 'Delfus News',
      avatar_url: 'https://delfus.app/news.png',
    },
  },
] as const;

export const VALID_SEND_REQUESTS = [
  {
    name: 'envio modo bot',
    request: {
      mode: 'bot',
      channelId: '123456789012345678',
      data: { content: 'oi' },
    },
  },
  {
    name: 'envio modo webhook com remetente customizado',
    request: {
      mode: 'webhook',
      channelId: '123456789012345678',
      data: { content: 'oi', username: 'Delfus News' },
    },
  },
  {
    name: 'edição modo webhook (messageId + webhookId)',
    request: {
      mode: 'webhook',
      channelId: '123456789012345678',
      messageId: '876543210987654321',
      webhookId: '111111111111111111',
      data: { embeds: [{ title: 'Editado' }] },
    },
  },
] as const;
