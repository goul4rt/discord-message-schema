"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/fixtures/index.ts
var fixtures_exports = {};
__export(fixtures_exports, {
  EVENT_DROPS_HALLOWEEN_2026: () => EVENT_DROPS_HALLOWEEN_2026,
  EVENT_DROPS_HALLOWEEN_2026_PARSED: () => EVENT_DROPS_HALLOWEEN_2026_PARSED,
  EVENT_DROPS_INVALID: () => EVENT_DROPS_INVALID,
  INVALID_MESSAGES: () => INVALID_MESSAGES,
  INVALID_SEND_REQUESTS: () => INVALID_SEND_REQUESTS,
  VALID_MESSAGES: () => VALID_MESSAGES,
  VALID_SEND_REQUESTS: () => VALID_SEND_REQUESTS
});
module.exports = __toCommonJS(fixtures_exports);

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

// src/fixtures/event-drops.ts
var EVENT_DROPS_HALLOWEEN_2026 = {
  version: 1,
  timezone: "America/Cuiaba",
  role_id: "1566211337682419843",
  staff_channel_id: "1456007940552261642",
  event_role_duration: "forever",
  points: {
    first: 10,
    repeat: 1
  },
  trick_chance: 0.3,
  anti_abuse: {
    min_member_age_days: 3,
    excluded_role_ids: [],
    max_candies_per_user_per_day: null
  },
  activity: {
    enabled: true,
    channel_ids: ["1440008957333733479"],
    window_seconds: 300,
    threshold: 4,
    chance: 0.15,
    channel_cooldown_minutes: 20,
    global_cooldown_minutes: 0,
    min_message_length: 3,
    per_user_seconds: 20,
    rarity_weights: {
      comum: 60,
      incomum: 30,
      raro: 10
    }
  },
  schedule: [
    {
      at: "2026-11-01T00:00:00-04:00",
      drop_key: "meia-noite",
      channel_id: "1440008957333733479"
    },
    {
      at: "2026-11-02T00:00:00-04:00",
      drop_key: "meia-noite",
      channel_id: "1440008957333733479"
    }
  ],
  thread: {
    forum_ids: ["1432911590717657168"],
    allow_preexisting: false,
    min_replies: 5,
    min_distinct_users: 3,
    min_chars: 3,
    reaction_emoji: "\u{1F383}",
    max_rewards_per_user: 1,
    reply_message: "\u{1F383} Esse post rendeu conversa! {{USER}} ganhou o cargo do Halloween."
  },
  drops: [
    {
      key: "abobora",
      mechanic: "botao_sorteio",
      rarity: "comum",
      embed: {
        title: "\u{1F383} Uma ab\xF3bora apareceu no chat!",
        description: "Ela t\xE1 rolando pelo canal. Clica antes que ela suma.",
        color: "#ff7518"
      },
      duration_seconds: 90,
      slots: 5,
      button_label: "Pegar a ab\xF3bora",
      messages: {
        trick: "\u{1F47B} BUH! A ab\xF3bora era oca e tinha um fantasma dentro. Travessura!",
        late: "A ab\xF3bora j\xE1 rolou embora. Fica pra pr\xF3xima."
      }
    },
    {
      key: "abobora-podre",
      mechanic: "escolha_fixa",
      rarity: "comum",
      embed: {
        title: "\u{1F383} Tr\xEAs ab\xF3boras na porta",
        description: "Uma t\xE1 podre, uma t\xE1 vazia e uma t\xE1 cheia de doce. Escolhe bem.",
        color: "#d35400"
      },
      duration_seconds: 90,
      slots: 5,
      options: [
        {
          key: "esquerda",
          label: "Ab\xF3bora da esquerda",
          emoji: "\u{1F383}",
          outcome: "trick"
        },
        {
          key: "meio",
          label: "Ab\xF3bora do meio",
          emoji: "\u{1F383}",
          outcome: "candy"
        },
        {
          key: "direita",
          label: "Ab\xF3bora da direita",
          emoji: "\u{1F383}",
          outcome: "empty"
        }
      ],
      messages: {
        trick: "\u{1F922} Ab\xF3bora podre! O cheiro vai te acompanhar a noite toda.",
        empty: "S\xF3 tinha semente a\xED dentro."
      }
    },
    {
      key: "iara",
      mechanic: "escolha",
      rarity: "incomum",
      embed: {
        title: "\u{1F9DC}\u200D\u2640\uFE0F A Iara t\xE1 cantando no rio",
        description: "Ela oferece quatro conchas. S\xF3 algumas guardam doce, e elas mudam de lugar toda vez.",
        color: "#1e90ff"
      },
      duration_seconds: 120,
      slots: 4,
      options: [
        {
          key: "azul",
          label: "Concha azul",
          emoji: "\u{1F41A}"
        },
        {
          key: "rosa",
          label: "Concha rosa",
          emoji: "\u{1F41A}"
        },
        {
          key: "verde",
          label: "Concha verde",
          emoji: "\u{1F41A}"
        },
        {
          key: "negra",
          label: "Concha negra",
          emoji: "\u{1F41A}"
        }
      ],
      distribution: {
        candy: 2,
        trick: 1,
        empty: 1
      },
      messages: {
        trick: "\u{1F30A} A Iara te puxou pro fundo do rio. Travessura!",
        empty: "A concha tava vazia. A Iara ri e some na \xE1gua."
      }
    },
    {
      key: "homem-do-saco",
      mechanic: "escolha",
      rarity: "incomum",
      embed: {
        title: "\u{1F392} O Homem do Saco passou por aqui",
        description: "Ele deixou cinco sacos pelo caminho. Uns t\xEAm doce. Outros t\xEAm... ele.",
        color: "#6d4c41"
      },
      duration_seconds: 120,
      slots: 4,
      options: [
        {
          key: "s1",
          label: "Saco 1",
          emoji: "\u{1F4B0}"
        },
        {
          key: "s2",
          label: "Saco 2",
          emoji: "\u{1F4B0}"
        },
        {
          key: "s3",
          label: "Saco 3",
          emoji: "\u{1F4B0}"
        },
        {
          key: "s4",
          label: "Saco 4",
          emoji: "\u{1F4B0}"
        },
        {
          key: "s5",
          label: "Saco 5",
          emoji: "\u{1F4B0}"
        }
      ],
      distribution: {
        candy: 2,
        trick: 2,
        empty: 1
      },
      messages: {
        trick: "\u{1F631} Era o Homem do Saco! Ele te levou embora. Travessura!",
        empty: "S\xF3 tinha pedra no saco."
      }
    },
    {
      key: "lobisomem",
      mechanic: "botao_sorteio",
      rarity: "incomum",
      trick_chance: 0.5,
      embed: {
        title: "\u{1F43A} Uivo na lua cheia",
        description: "O lobisomem t\xE1 rondando o chat. Arrisca chegar perto?",
        color: "#455a64"
      },
      duration_seconds: 90,
      slots: 4,
      button_label: "Chegar perto",
      messages: {
        trick: "\u{1F43A} AUUU! O lobisomem te mordeu. Travessura!",
        candy: "O lobisomem tava de bom humor e te deu um doce."
      }
    },
    {
      key: "saci",
      mechanic: "digitar",
      rarity: "comum",
      embed: {
        title: "\u{1F32A}\uFE0F O Saci roubou seu gorro!",
        description: "Digita **SACI** no chat pra pegar de volta. S\xF3 os 5 primeiros conseguem.",
        color: "#c0392b"
      },
      duration_seconds: 60,
      slots: 5,
      answers: ["saci", "saci perere", "saci-perere"]
    },
    {
      key: "mula",
      mechanic: "digitar",
      rarity: "comum",
      embed: {
        title: "\u{1F525} Uma mula sem cabe\xE7a cruzou o chat",
        description: "Pra ela n\xE3o voltar, digita **DOCES OU TRAVESSURAS** rapidinho.",
        color: "#e67e22"
      },
      duration_seconds: 60,
      slots: 5,
      answers: ["doces ou travessuras", "doce ou travessura", "gostosuras ou travessuras"]
    },
    {
      key: "curupira",
      mechanic: "quiz",
      rarity: "incomum",
      embed: {
        title: "\u{1F9B6} Enigma do Curupira",
        description: "Qual criatura do folclore tem os p\xE9s virados pra tr\xE1s?\n\nClica na resposta certa. Errou, n\xE3o tenta de novo.",
        color: "#2e8b57"
      },
      duration_seconds: 90,
      slots: 5,
      options: [
        {
          key: "a",
          label: "Boitat\xE1"
        },
        {
          key: "b",
          label: "Curupira"
        },
        {
          key: "c",
          label: "Mula sem cabe\xE7a"
        }
      ],
      answers: ["b"]
    },
    {
      key: "cuca",
      mechanic: "quiz",
      rarity: "incomum",
      embed: {
        title: "\u{1F40A} A Cuca quer saber",
        description: "Em qual obra a Cuca ficou famosa?\n\nClica na resposta certa. Errou, n\xE3o tenta de novo.",
        color: "#27ae60"
      },
      duration_seconds: 90,
      slots: 5,
      options: [
        {
          key: "a",
          label: "S\xEDtio do Picapau Amarelo"
        },
        {
          key: "b",
          label: "Turma da M\xF4nica"
        },
        {
          key: "c",
          label: "Castelo R\xE1-Tim-Bum"
        }
      ],
      answers: ["a"]
    },
    {
      key: "boitata",
      mechanic: "escolha_fixa",
      rarity: "raro",
      trick_chance: 0,
      embed: {
        title: "\u{1F525}\u{1F40D} O Boitat\xE1 iluminou a mata",
        description: "Tr\xEAs trilhas acesas. S\xF3 uma leva ao doce, e o Boitat\xE1 n\xE3o faz travessura.",
        color: "#ff4500"
      },
      duration_seconds: 120,
      slots: 3,
      options: [
        {
          key: "norte",
          label: "Trilha norte",
          emoji: "\u{1F332}",
          outcome: "empty"
        },
        {
          key: "sul",
          label: "Trilha sul",
          emoji: "\u{1F332}",
          outcome: "candy"
        },
        {
          key: "leste",
          label: "Trilha leste",
          emoji: "\u{1F332}",
          outcome: "empty"
        }
      ],
      points: {
        first: 15,
        repeat: 3
      },
      messages: {
        empty: "A trilha acabou num brejo. Nada de doce."
      }
    },
    {
      key: "abobora-dourada",
      mechanic: "botao_sorteio",
      rarity: "raro",
      trick_chance: 0,
      embed: {
        title: "\u2728\u{1F383} AB\xD3BORA DOURADA!",
        description: "Rara de verdade. Tr\xEAs vagas, sem travessura.",
        color: "#f1c40f"
      },
      duration_seconds: 90,
      slots: 3,
      button_label: "Pegar a dourada",
      points: {
        first: 20,
        repeat: 5
      }
    },
    {
      key: "abobora-gigante",
      mechanic: "botao_sorteio",
      rarity: "raro",
      max_per_day: 1,
      trick_chance: 0,
      embed: {
        title: "\u{1F383}\u{1F383}\u{1F383} AB\xD3BORA GIGANTE!",
        description: "S\xF3 aparece uma vez por dia. Dez vagas, sem travessura.",
        color: "#ffa500"
      },
      duration_seconds: 180,
      slots: 10,
      button_label: "Abra\xE7ar a ab\xF3bora",
      points: {
        first: 25,
        repeat: 3
      }
    },
    {
      key: "meia-noite",
      mechanic: "botao_sorteio",
      rarity: "raro",
      trick_chance: 0,
      embed: {
        title: "\u{1F55B} Deu meia-noite",
        description: "O v\xE9u entre os mundos t\xE1 fino. Os 20 primeiros a clicar levam doce.",
        color: "#4b0082"
      },
      duration_seconds: 300,
      slots: 20,
      button_label: "Atravessar o v\xE9u",
      points: {
        first: 15,
        repeat: 2
      },
      in_activity: false
    }
  ]
};
var EVENT_DROPS_HALLOWEEN_2026_PARSED = {
  version: 1,
  timezone: "America/Cuiaba",
  role_id: "1566211337682419843",
  staff_channel_id: "1456007940552261642",
  event_role_duration: "forever",
  points: { first: 10, repeat: 1 },
  trick_chance: 0.3,
  anti_abuse: { min_member_age_days: 3, excluded_role_ids: [], max_candies_per_user_per_day: null },
  activity: {
    enabled: true,
    channel_ids: ["1440008957333733479"],
    window_seconds: 300,
    threshold: 4,
    chance: 0.15,
    channel_cooldown_minutes: 20,
    global_cooldown_minutes: 0,
    min_message_length: 3,
    per_user_seconds: 20,
    rarity_weights: { comum: 60, incomum: 30, raro: 10 }
  },
  schedule: [
    { at: "2026-11-01T00:00:00-04:00", drop_key: "meia-noite", channel_id: "1440008957333733479" },
    { at: "2026-11-02T00:00:00-04:00", drop_key: "meia-noite", channel_id: "1440008957333733479" }
  ],
  drops: [
    {
      key: "abobora",
      mechanic: "botao_sorteio",
      rarity: "comum",
      embed: {
        title: "\u{1F383} Uma ab\xF3bora apareceu no chat!",
        description: "Ela t\xE1 rolando pelo canal. Clica antes que ela suma.",
        color: "#ff7518"
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      button_label: "Pegar a ab\xF3bora",
      messages: {
        trick: "\u{1F47B} BUH! A ab\xF3bora era oca e tinha um fantasma dentro. Travessura!",
        late: "A ab\xF3bora j\xE1 rolou embora. Fica pra pr\xF3xima."
      }
    },
    {
      key: "abobora-podre",
      mechanic: "escolha_fixa",
      rarity: "comum",
      embed: {
        title: "\u{1F383} Tr\xEAs ab\xF3boras na porta",
        description: "Uma t\xE1 podre, uma t\xE1 vazia e uma t\xE1 cheia de doce. Escolhe bem.",
        color: "#d35400"
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: "esquerda", label: "Ab\xF3bora da esquerda", emoji: "\u{1F383}", outcome: "trick" },
        { key: "meio", label: "Ab\xF3bora do meio", emoji: "\u{1F383}", outcome: "candy" },
        { key: "direita", label: "Ab\xF3bora da direita", emoji: "\u{1F383}", outcome: "empty" }
      ],
      messages: {
        trick: "\u{1F922} Ab\xF3bora podre! O cheiro vai te acompanhar a noite toda.",
        empty: "S\xF3 tinha semente a\xED dentro."
      }
    },
    {
      key: "iara",
      mechanic: "escolha",
      rarity: "incomum",
      embed: {
        title: "\u{1F9DC}\u200D\u2640\uFE0F A Iara t\xE1 cantando no rio",
        description: "Ela oferece quatro conchas. S\xF3 algumas guardam doce, e elas mudam de lugar toda vez.",
        color: "#1e90ff"
      },
      duration_seconds: 120,
      slots: 4,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: "azul", label: "Concha azul", emoji: "\u{1F41A}" },
        { key: "rosa", label: "Concha rosa", emoji: "\u{1F41A}" },
        { key: "verde", label: "Concha verde", emoji: "\u{1F41A}" },
        { key: "negra", label: "Concha negra", emoji: "\u{1F41A}" }
      ],
      distribution: { candy: 2, trick: 1, empty: 1 },
      messages: {
        trick: "\u{1F30A} A Iara te puxou pro fundo do rio. Travessura!",
        empty: "A concha tava vazia. A Iara ri e some na \xE1gua."
      }
    },
    {
      key: "homem-do-saco",
      mechanic: "escolha",
      rarity: "incomum",
      embed: {
        title: "\u{1F392} O Homem do Saco passou por aqui",
        description: "Ele deixou cinco sacos pelo caminho. Uns t\xEAm doce. Outros t\xEAm... ele.",
        color: "#6d4c41"
      },
      duration_seconds: 120,
      slots: 4,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: "s1", label: "Saco 1", emoji: "\u{1F4B0}" },
        { key: "s2", label: "Saco 2", emoji: "\u{1F4B0}" },
        { key: "s3", label: "Saco 3", emoji: "\u{1F4B0}" },
        { key: "s4", label: "Saco 4", emoji: "\u{1F4B0}" },
        { key: "s5", label: "Saco 5", emoji: "\u{1F4B0}" }
      ],
      distribution: { candy: 2, trick: 2, empty: 1 },
      messages: {
        trick: "\u{1F631} Era o Homem do Saco! Ele te levou embora. Travessura!",
        empty: "S\xF3 tinha pedra no saco."
      }
    },
    {
      key: "lobisomem",
      mechanic: "botao_sorteio",
      rarity: "incomum",
      embed: {
        title: "\u{1F43A} Uivo na lua cheia",
        description: "O lobisomem t\xE1 rondando o chat. Arrisca chegar perto?",
        color: "#455a64"
      },
      duration_seconds: 90,
      slots: 4,
      trick_chance: 0.5,
      empty_chance: 0,
      in_activity: true,
      button_label: "Chegar perto",
      messages: {
        candy: "O lobisomem tava de bom humor e te deu um doce.",
        trick: "\u{1F43A} AUUU! O lobisomem te mordeu. Travessura!"
      }
    },
    {
      key: "saci",
      mechanic: "digitar",
      rarity: "comum",
      embed: {
        title: "\u{1F32A}\uFE0F O Saci roubou seu gorro!",
        description: "Digita **SACI** no chat pra pegar de volta. S\xF3 os 5 primeiros conseguem.",
        color: "#c0392b"
      },
      duration_seconds: 60,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      answers: ["saci", "saci perere", "saci-perere"],
      messages: {}
    },
    {
      key: "mula",
      mechanic: "digitar",
      rarity: "comum",
      embed: {
        title: "\u{1F525} Uma mula sem cabe\xE7a cruzou o chat",
        description: "Pra ela n\xE3o voltar, digita **DOCES OU TRAVESSURAS** rapidinho.",
        color: "#e67e22"
      },
      duration_seconds: 60,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      answers: ["doces ou travessuras", "doce ou travessura", "gostosuras ou travessuras"],
      messages: {}
    },
    {
      key: "curupira",
      mechanic: "quiz",
      rarity: "incomum",
      embed: {
        title: "\u{1F9B6} Enigma do Curupira",
        description: "Qual criatura do folclore tem os p\xE9s virados pra tr\xE1s?\n\nClica na resposta certa. Errou, n\xE3o tenta de novo.",
        color: "#2e8b57"
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: "a", label: "Boitat\xE1" },
        { key: "b", label: "Curupira" },
        { key: "c", label: "Mula sem cabe\xE7a" }
      ],
      answers: ["b"],
      messages: {}
    },
    {
      key: "cuca",
      mechanic: "quiz",
      rarity: "incomum",
      embed: {
        title: "\u{1F40A} A Cuca quer saber",
        description: "Em qual obra a Cuca ficou famosa?\n\nClica na resposta certa. Errou, n\xE3o tenta de novo.",
        color: "#27ae60"
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: "a", label: "S\xEDtio do Picapau Amarelo" },
        { key: "b", label: "Turma da M\xF4nica" },
        { key: "c", label: "Castelo R\xE1-Tim-Bum" }
      ],
      answers: ["a"],
      messages: {}
    },
    {
      key: "boitata",
      mechanic: "escolha_fixa",
      rarity: "raro",
      embed: {
        title: "\u{1F525}\u{1F40D} O Boitat\xE1 iluminou a mata",
        description: "Tr\xEAs trilhas acesas. S\xF3 uma leva ao doce, e o Boitat\xE1 n\xE3o faz travessura.",
        color: "#ff4500"
      },
      duration_seconds: 120,
      slots: 3,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 15, repeat: 3 },
      in_activity: true,
      options: [
        { key: "norte", label: "Trilha norte", emoji: "\u{1F332}", outcome: "empty" },
        { key: "sul", label: "Trilha sul", emoji: "\u{1F332}", outcome: "candy" },
        { key: "leste", label: "Trilha leste", emoji: "\u{1F332}", outcome: "empty" }
      ],
      messages: { empty: "A trilha acabou num brejo. Nada de doce." }
    },
    {
      key: "abobora-dourada",
      mechanic: "botao_sorteio",
      rarity: "raro",
      embed: {
        title: "\u2728\u{1F383} AB\xD3BORA DOURADA!",
        description: "Rara de verdade. Tr\xEAs vagas, sem travessura.",
        color: "#f1c40f"
      },
      duration_seconds: 90,
      slots: 3,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 20, repeat: 5 },
      in_activity: true,
      button_label: "Pegar a dourada",
      messages: {}
    },
    {
      key: "abobora-gigante",
      mechanic: "botao_sorteio",
      rarity: "raro",
      embed: {
        title: "\u{1F383}\u{1F383}\u{1F383} AB\xD3BORA GIGANTE!",
        description: "S\xF3 aparece uma vez por dia. Dez vagas, sem travessura.",
        color: "#ffa500"
      },
      duration_seconds: 180,
      slots: 10,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 25, repeat: 3 },
      in_activity: true,
      max_per_day: 1,
      button_label: "Abra\xE7ar a ab\xF3bora",
      messages: {}
    },
    {
      key: "meia-noite",
      mechanic: "botao_sorteio",
      rarity: "raro",
      embed: {
        title: "\u{1F55B} Deu meia-noite",
        description: "O v\xE9u entre os mundos t\xE1 fino. Os 20 primeiros a clicar levam doce.",
        color: "#4b0082"
      },
      duration_seconds: 300,
      slots: 20,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 15, repeat: 2 },
      in_activity: false,
      button_label: "Atravessar o v\xE9u",
      messages: {}
    }
  ],
  thread: {
    forum_ids: ["1432911590717657168"],
    allow_preexisting: false,
    min_replies: 5,
    min_distinct_users: 3,
    min_chars: 3,
    reaction_emoji: "\u{1F383}",
    max_rewards_per_user: 1,
    reply_message: "\u{1F383} Esse post rendeu conversa! {{USER}} ganhou o cargo do Halloween."
  }
};
var base = () => structuredClone(EVENT_DROPS_HALLOWEEN_2026);
var drop = (c, key) => c.drops.find((d) => d.key === key);
var mutate = (fn) => {
  const c = base();
  fn(c);
  return c;
};
var EVENT_DROPS_INVALID = [
  {
    name: "escolha sem options",
    config: mutate((c) => delete drop(c, "iara").options),
    expectPath: ["drops", 2, "options"]
  },
  {
    name: "escolha_fixa com op\xE7\xE3o sem outcome",
    config: mutate((c) => delete drop(c, "abobora-podre").options[0].outcome),
    expectPath: ["drops", 1, "options"]
  },
  {
    name: "distribution n\xE3o soma options.length",
    config: mutate((c) => drop(c, "iara").distribution.candy = 3),
    expectPath: ["drops", 2, "distribution"]
  },
  {
    name: "digitar sem answers",
    config: mutate((c) => delete drop(c, "saci").answers),
    expectPath: ["drops", 5, "answers"]
  },
  {
    name: "drop.key duplicado",
    config: mutate((c) => c.drops[1].key = c.drops[0].key),
    expectPath: ["drops", 1, "key"]
  },
  {
    name: "schedule com drop_key inexistente",
    config: mutate((c) => c.schedule[1].drop_key = "nao-existe"),
    expectPath: ["schedule", 1, "drop_key"]
  },
  {
    name: "role_id n\xE3o \xE9 snowflake",
    config: mutate((c) => c.role_id = "abc"),
    expectPath: ["role_id"]
  },
  {
    name: "drops vazio",
    config: mutate((c) => c.drops = []),
    expectPath: ["drops"]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EVENT_DROPS_HALLOWEEN_2026,
  EVENT_DROPS_HALLOWEEN_2026_PARSED,
  EVENT_DROPS_INVALID,
  INVALID_MESSAGES,
  INVALID_SEND_REQUESTS,
  VALID_MESSAGES,
  VALID_SEND_REQUESTS
});
//# sourceMappingURL=index.cjs.map