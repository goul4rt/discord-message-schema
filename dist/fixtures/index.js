// src/fixtures/valid.ts
var VALID_MESSAGES = [
  {
    name: "mensagem m\xEDnima (s\xF3 content)",
    message: { content: "Ol\xE1, mundo!" }
  },
  {
    name: "mensagem completa (content + 2 embeds + bot\xF5es de link + mentions)",
    message: {
      content: "Confira as novidades do {{server}}!",
      embeds: [
        {
          title: "Regras do servidor",
          description: "Leia **com aten\xE7\xE3o** antes de participar.",
          url: "https://delfus.app/regras",
          color: 5793266,
          timestamp: "2026-06-11T12:00:00.000Z",
          author: { name: "Equipe Delfus", icon_url: "{{serverIcon}}" },
          footer: { text: "Atualizado em junho de 2026" },
          thumbnail: { url: "{{serverIcon}}" },
          fields: [
            { name: "Respeito", value: "Trate todos bem.", inline: true },
            { name: "Spam", value: "Proibido flood.", inline: true }
          ]
        },
        {
          description: "Somos {{memberCount}} membros!",
          image: { url: "https://delfus.app/banner.png" },
          color: 5763719
        }
      ],
      components: [
        {
          type: 1,
          components: [
            { type: 2, style: 5, label: "Site", url: "https://delfus.app" },
            { type: 2, style: 5, emoji: { name: "\u{1F4D6}" }, url: "https://delfus.app/docs" }
          ]
        }
      ],
      allowed_mentions: { parse: ["users"] }
    }
  },
  {
    name: "mensagem de webhook (username + avatar customizados)",
    message: {
      content: "An\xFAncio oficial!",
      username: "Delfus News",
      avatar_url: "https://delfus.app/news.png"
    }
  }
];
var VALID_SEND_REQUESTS = [
  {
    name: "envio modo bot",
    request: {
      mode: "bot",
      channelId: "123456789012345678",
      data: { content: "oi" }
    }
  },
  {
    name: "envio modo webhook com remetente customizado",
    request: {
      mode: "webhook",
      channelId: "123456789012345678",
      data: { content: "oi", username: "Delfus News" }
    }
  },
  {
    name: "edi\xE7\xE3o modo webhook (messageId + webhookId)",
    request: {
      mode: "webhook",
      channelId: "123456789012345678",
      messageId: "876543210987654321",
      webhookId: "111111111111111111",
      data: { embeds: [{ title: "Editado" }] }
    }
  }
];

// src/fixtures/invalid.ts
var bigEmbed = { description: "a".repeat(4e3) };
var INVALID_MESSAGES = [
  { name: "mensagem vazia", message: {} },
  { name: "content acima de 2000 chars", message: { content: "a".repeat(2001) } },
  {
    name: "11 embeds",
    message: { embeds: Array.from({ length: 11 }, (_, i) => ({ title: `e${i}` })) }
  },
  { name: "embed vazio", message: { embeds: [{}] } },
  {
    name: "field sem name",
    message: { embeds: [{ fields: [{ name: "", value: "x" }] }] }
  },
  { name: "cor fora do range", message: { embeds: [{ title: "x", color: 16777216 }] } },
  { name: "total de embeds acima de 6000 chars", message: { embeds: [bigEmbed, bigEmbed] } },
  {
    name: "bot\xE3o de a\xE7\xE3o (style 1) na v1",
    message: {
      components: [
        { type: 1, components: [{ type: 2, style: 1, label: "x", custom_id: "id" }] }
      ]
    }
  },
  {
    name: "select menu na v1",
    message: {
      components: [
        {
          type: 1,
          components: [{ type: 3, custom_id: "sel", options: [{ label: "A", value: "a" }] }]
        }
      ]
    }
  },
  { name: "username proibido", message: { content: "x", username: "Discord Bot" } },
  { name: "url inv\xE1lida em image", message: { embeds: [{ image: { url: "nope" } }] } },
  { name: "title vazio com outro campo presente", message: { embeds: [{ title: "", description: "x" }] } },
  {
    name: "url com protocolo proibido mascarado por placeholder",
    message: { embeds: [{ image: { url: "javascript:alert(1){{serverIcon}}" } }] }
  },
  {
    name: "allowed_mentions parse users + lista users expl\xEDcita",
    message: {
      content: "x",
      allowed_mentions: { parse: ["users"], users: ["123456789012345678"] }
    }
  }
];
var INVALID_SEND_REQUESTS = [
  {
    name: "username no modo bot",
    request: {
      mode: "bot",
      channelId: "123456789012345678",
      data: { content: "x", username: "Delfus News" }
    }
  },
  {
    name: "channelId que n\xE3o \xE9 snowflake",
    request: { mode: "bot", channelId: "geral", data: { content: "x" } }
  },
  {
    name: "data inv\xE1lido (mensagem vazia)",
    request: { mode: "bot", channelId: "123456789012345678", data: {} }
  },
  {
    name: "edi\xE7\xE3o webhook sem webhookId",
    request: {
      mode: "webhook",
      channelId: "123456789012345678",
      messageId: "876543210987654321",
      data: { content: "editado" }
    }
  }
];
export {
  INVALID_MESSAGES,
  INVALID_SEND_REQUESTS,
  VALID_MESSAGES,
  VALID_SEND_REQUESTS
};
//# sourceMappingURL=index.js.map