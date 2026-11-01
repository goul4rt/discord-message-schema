import type { EventDropsConfig } from '../schema/event-drops';

/** Cópia exata de discord-bot src/scripts/data/halloween-2026.json (entrada crua, sem defaults). */
export const EVENT_DROPS_HALLOWEEN_2026 = {
  version: 1,
  timezone: 'America/Cuiaba',
  role_id: '1566211337682419843',
  staff_channel_id: '1456007940552261642',
  event_role_duration: 'forever',
  points: {
    first: 10,
    repeat: 1,
  },
  trick_chance: 0.3,
  anti_abuse: {
    min_member_age_days: 3,
    excluded_role_ids: [],
    max_candies_per_user_per_day: null,
  },
  activity: {
    enabled: true,
    channel_ids: ['1440008957333733479'],
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
      raro: 10,
    },
  },
  schedule: [
    {
      at: '2026-11-01T00:00:00-04:00',
      drop_key: 'meia-noite',
      channel_id: '1440008957333733479',
    },
    {
      at: '2026-11-02T00:00:00-04:00',
      drop_key: 'meia-noite',
      channel_id: '1440008957333733479',
    },
  ],
  thread: {
    forum_ids: ['1432911590717657168'],
    allow_preexisting: false,
    min_replies: 5,
    min_distinct_users: 3,
    min_chars: 3,
    reaction_emoji: '🎃',
    max_rewards_per_user: 1,
    reply_message: '🎃 Esse post rendeu conversa! {{USER}} ganhou o cargo do Halloween.',
  },
  drops: [
    {
      key: 'abobora',
      mechanic: 'botao_sorteio',
      rarity: 'comum',
      embed: {
        title: '🎃 Uma abóbora apareceu no chat!',
        description: 'Ela tá rolando pelo canal. Clica antes que ela suma.',
        color: '#ff7518',
      },
      duration_seconds: 90,
      slots: 5,
      button_label: 'Pegar a abóbora',
      messages: {
        trick: '👻 BUH! A abóbora era oca e tinha um fantasma dentro. Travessura!',
        late: 'A abóbora já rolou embora. Fica pra próxima.',
      },
    },
    {
      key: 'abobora-podre',
      mechanic: 'escolha_fixa',
      rarity: 'comum',
      embed: {
        title: '🎃 Três abóboras na porta',
        description: 'Uma tá podre, uma tá vazia e uma tá cheia de doce. Escolhe bem.',
        color: '#d35400',
      },
      duration_seconds: 90,
      slots: 5,
      options: [
        {
          key: 'esquerda',
          label: 'Abóbora da esquerda',
          emoji: '🎃',
          outcome: 'trick',
        },
        {
          key: 'meio',
          label: 'Abóbora do meio',
          emoji: '🎃',
          outcome: 'candy',
        },
        {
          key: 'direita',
          label: 'Abóbora da direita',
          emoji: '🎃',
          outcome: 'empty',
        },
      ],
      messages: {
        trick: '🤢 Abóbora podre! O cheiro vai te acompanhar a noite toda.',
        empty: 'Só tinha semente aí dentro.',
      },
    },
    {
      key: 'iara',
      mechanic: 'escolha',
      rarity: 'incomum',
      embed: {
        title: '🧜‍♀️ A Iara tá cantando no rio',
        description:
          'Ela oferece quatro conchas. Só algumas guardam doce, e elas mudam de lugar toda vez.',
        color: '#1e90ff',
      },
      duration_seconds: 120,
      slots: 4,
      options: [
        {
          key: 'azul',
          label: 'Concha azul',
          emoji: '🐚',
        },
        {
          key: 'rosa',
          label: 'Concha rosa',
          emoji: '🐚',
        },
        {
          key: 'verde',
          label: 'Concha verde',
          emoji: '🐚',
        },
        {
          key: 'negra',
          label: 'Concha negra',
          emoji: '🐚',
        },
      ],
      distribution: {
        candy: 2,
        trick: 1,
        empty: 1,
      },
      messages: {
        trick: '🌊 A Iara te puxou pro fundo do rio. Travessura!',
        empty: 'A concha tava vazia. A Iara ri e some na água.',
      },
    },
    {
      key: 'homem-do-saco',
      mechanic: 'escolha',
      rarity: 'incomum',
      embed: {
        title: '🎒 O Homem do Saco passou por aqui',
        description: 'Ele deixou cinco sacos pelo caminho. Uns têm doce. Outros têm... ele.',
        color: '#6d4c41',
      },
      duration_seconds: 120,
      slots: 4,
      options: [
        {
          key: 's1',
          label: 'Saco 1',
          emoji: '💰',
        },
        {
          key: 's2',
          label: 'Saco 2',
          emoji: '💰',
        },
        {
          key: 's3',
          label: 'Saco 3',
          emoji: '💰',
        },
        {
          key: 's4',
          label: 'Saco 4',
          emoji: '💰',
        },
        {
          key: 's5',
          label: 'Saco 5',
          emoji: '💰',
        },
      ],
      distribution: {
        candy: 2,
        trick: 2,
        empty: 1,
      },
      messages: {
        trick: '😱 Era o Homem do Saco! Ele te levou embora. Travessura!',
        empty: 'Só tinha pedra no saco.',
      },
    },
    {
      key: 'lobisomem',
      mechanic: 'botao_sorteio',
      rarity: 'incomum',
      trick_chance: 0.5,
      embed: {
        title: '🐺 Uivo na lua cheia',
        description: 'O lobisomem tá rondando o chat. Arrisca chegar perto?',
        color: '#455a64',
      },
      duration_seconds: 90,
      slots: 4,
      button_label: 'Chegar perto',
      messages: {
        trick: '🐺 AUUU! O lobisomem te mordeu. Travessura!',
        candy: 'O lobisomem tava de bom humor e te deu um doce.',
      },
    },
    {
      key: 'saci',
      mechanic: 'digitar',
      rarity: 'comum',
      embed: {
        title: '🌪️ O Saci roubou seu gorro!',
        description: 'Digita **SACI** no chat pra pegar de volta. Só os 5 primeiros conseguem.',
        color: '#c0392b',
      },
      duration_seconds: 60,
      slots: 5,
      answers: ['saci', 'saci perere', 'saci-perere'],
    },
    {
      key: 'mula',
      mechanic: 'digitar',
      rarity: 'comum',
      embed: {
        title: '🔥 Uma mula sem cabeça cruzou o chat',
        description: 'Pra ela não voltar, digita **DOCES OU TRAVESSURAS** rapidinho.',
        color: '#e67e22',
      },
      duration_seconds: 60,
      slots: 5,
      answers: ['doces ou travessuras', 'doce ou travessura', 'gostosuras ou travessuras'],
    },
    {
      key: 'curupira',
      mechanic: 'quiz',
      rarity: 'incomum',
      embed: {
        title: '🦶 Enigma do Curupira',
        description:
          'Qual criatura do folclore tem os pés virados pra trás?\n\nClica na resposta certa. Errou, não tenta de novo.',
        color: '#2e8b57',
      },
      duration_seconds: 90,
      slots: 5,
      options: [
        {
          key: 'a',
          label: 'Boitatá',
        },
        {
          key: 'b',
          label: 'Curupira',
        },
        {
          key: 'c',
          label: 'Mula sem cabeça',
        },
      ],
      answers: ['b'],
    },
    {
      key: 'cuca',
      mechanic: 'quiz',
      rarity: 'incomum',
      embed: {
        title: '🐊 A Cuca quer saber',
        description:
          'Em qual obra a Cuca ficou famosa?\n\nClica na resposta certa. Errou, não tenta de novo.',
        color: '#27ae60',
      },
      duration_seconds: 90,
      slots: 5,
      options: [
        {
          key: 'a',
          label: 'Sítio do Picapau Amarelo',
        },
        {
          key: 'b',
          label: 'Turma da Mônica',
        },
        {
          key: 'c',
          label: 'Castelo Rá-Tim-Bum',
        },
      ],
      answers: ['a'],
    },
    {
      key: 'boitata',
      mechanic: 'escolha_fixa',
      rarity: 'raro',
      trick_chance: 0,
      embed: {
        title: '🔥🐍 O Boitatá iluminou a mata',
        description: 'Três trilhas acesas. Só uma leva ao doce, e o Boitatá não faz travessura.',
        color: '#ff4500',
      },
      duration_seconds: 120,
      slots: 3,
      options: [
        {
          key: 'norte',
          label: 'Trilha norte',
          emoji: '🌲',
          outcome: 'empty',
        },
        {
          key: 'sul',
          label: 'Trilha sul',
          emoji: '🌲',
          outcome: 'candy',
        },
        {
          key: 'leste',
          label: 'Trilha leste',
          emoji: '🌲',
          outcome: 'empty',
        },
      ],
      points: {
        first: 15,
        repeat: 3,
      },
      messages: {
        empty: 'A trilha acabou num brejo. Nada de doce.',
      },
    },
    {
      key: 'abobora-dourada',
      mechanic: 'botao_sorteio',
      rarity: 'raro',
      trick_chance: 0,
      embed: {
        title: '✨🎃 ABÓBORA DOURADA!',
        description: 'Rara de verdade. Três vagas, sem travessura.',
        color: '#f1c40f',
      },
      duration_seconds: 90,
      slots: 3,
      button_label: 'Pegar a dourada',
      points: {
        first: 20,
        repeat: 5,
      },
    },
    {
      key: 'abobora-gigante',
      mechanic: 'botao_sorteio',
      rarity: 'raro',
      max_per_day: 1,
      trick_chance: 0,
      embed: {
        title: '🎃🎃🎃 ABÓBORA GIGANTE!',
        description: 'Só aparece uma vez por dia. Dez vagas, sem travessura.',
        color: '#ffa500',
      },
      duration_seconds: 180,
      slots: 10,
      button_label: 'Abraçar a abóbora',
      points: {
        first: 25,
        repeat: 3,
      },
    },
    {
      key: 'meia-noite',
      mechanic: 'botao_sorteio',
      rarity: 'raro',
      trick_chance: 0,
      embed: {
        title: '🕛 Deu meia-noite',
        description: 'O véu entre os mundos tá fino. Os 20 primeiros a clicar levam doce.',
        color: '#4b0082',
      },
      duration_seconds: 300,
      slots: 20,
      button_label: 'Atravessar o véu',
      points: {
        first: 15,
        repeat: 2,
      },
      in_activity: false,
    },
  ],
};

/** Saída esperada de eventDropsConfigSchema.parse(EVENT_DROPS_HALLOWEEN_2026) (com defaults). */
export const EVENT_DROPS_HALLOWEEN_2026_PARSED: EventDropsConfig = {
  version: 1,
  timezone: 'America/Cuiaba',
  role_id: '1566211337682419843',
  staff_channel_id: '1456007940552261642',
  event_role_duration: 'forever',
  points: { first: 10, repeat: 1 },
  trick_chance: 0.3,
  anti_abuse: { min_member_age_days: 3, excluded_role_ids: [], max_candies_per_user_per_day: null },
  activity: {
    enabled: true,
    channel_ids: ['1440008957333733479'],
    window_seconds: 300,
    threshold: 4,
    chance: 0.15,
    channel_cooldown_minutes: 20,
    global_cooldown_minutes: 0,
    min_message_length: 3,
    per_user_seconds: 20,
    rarity_weights: { comum: 60, incomum: 30, raro: 10 },
  },
  schedule: [
    { at: '2026-11-01T00:00:00-04:00', drop_key: 'meia-noite', channel_id: '1440008957333733479' },
    { at: '2026-11-02T00:00:00-04:00', drop_key: 'meia-noite', channel_id: '1440008957333733479' },
  ],
  drops: [
    {
      key: 'abobora',
      mechanic: 'botao_sorteio',
      rarity: 'comum',
      embed: {
        title: '🎃 Uma abóbora apareceu no chat!',
        description: 'Ela tá rolando pelo canal. Clica antes que ela suma.',
        color: '#ff7518',
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      button_label: 'Pegar a abóbora',
      messages: {
        trick: '👻 BUH! A abóbora era oca e tinha um fantasma dentro. Travessura!',
        late: 'A abóbora já rolou embora. Fica pra próxima.',
      },
    },
    {
      key: 'abobora-podre',
      mechanic: 'escolha_fixa',
      rarity: 'comum',
      embed: {
        title: '🎃 Três abóboras na porta',
        description: 'Uma tá podre, uma tá vazia e uma tá cheia de doce. Escolhe bem.',
        color: '#d35400',
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: 'esquerda', label: 'Abóbora da esquerda', emoji: '🎃', outcome: 'trick' },
        { key: 'meio', label: 'Abóbora do meio', emoji: '🎃', outcome: 'candy' },
        { key: 'direita', label: 'Abóbora da direita', emoji: '🎃', outcome: 'empty' },
      ],
      messages: {
        trick: '🤢 Abóbora podre! O cheiro vai te acompanhar a noite toda.',
        empty: 'Só tinha semente aí dentro.',
      },
    },
    {
      key: 'iara',
      mechanic: 'escolha',
      rarity: 'incomum',
      embed: {
        title: '🧜‍♀️ A Iara tá cantando no rio',
        description:
          'Ela oferece quatro conchas. Só algumas guardam doce, e elas mudam de lugar toda vez.',
        color: '#1e90ff',
      },
      duration_seconds: 120,
      slots: 4,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: 'azul', label: 'Concha azul', emoji: '🐚' },
        { key: 'rosa', label: 'Concha rosa', emoji: '🐚' },
        { key: 'verde', label: 'Concha verde', emoji: '🐚' },
        { key: 'negra', label: 'Concha negra', emoji: '🐚' },
      ],
      distribution: { candy: 2, trick: 1, empty: 1 },
      messages: {
        trick: '🌊 A Iara te puxou pro fundo do rio. Travessura!',
        empty: 'A concha tava vazia. A Iara ri e some na água.',
      },
    },
    {
      key: 'homem-do-saco',
      mechanic: 'escolha',
      rarity: 'incomum',
      embed: {
        title: '🎒 O Homem do Saco passou por aqui',
        description: 'Ele deixou cinco sacos pelo caminho. Uns têm doce. Outros têm... ele.',
        color: '#6d4c41',
      },
      duration_seconds: 120,
      slots: 4,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: 's1', label: 'Saco 1', emoji: '💰' },
        { key: 's2', label: 'Saco 2', emoji: '💰' },
        { key: 's3', label: 'Saco 3', emoji: '💰' },
        { key: 's4', label: 'Saco 4', emoji: '💰' },
        { key: 's5', label: 'Saco 5', emoji: '💰' },
      ],
      distribution: { candy: 2, trick: 2, empty: 1 },
      messages: {
        trick: '😱 Era o Homem do Saco! Ele te levou embora. Travessura!',
        empty: 'Só tinha pedra no saco.',
      },
    },
    {
      key: 'lobisomem',
      mechanic: 'botao_sorteio',
      rarity: 'incomum',
      embed: {
        title: '🐺 Uivo na lua cheia',
        description: 'O lobisomem tá rondando o chat. Arrisca chegar perto?',
        color: '#455a64',
      },
      duration_seconds: 90,
      slots: 4,
      trick_chance: 0.5,
      empty_chance: 0,
      in_activity: true,
      button_label: 'Chegar perto',
      messages: {
        candy: 'O lobisomem tava de bom humor e te deu um doce.',
        trick: '🐺 AUUU! O lobisomem te mordeu. Travessura!',
      },
    },
    {
      key: 'saci',
      mechanic: 'digitar',
      rarity: 'comum',
      embed: {
        title: '🌪️ O Saci roubou seu gorro!',
        description: 'Digita **SACI** no chat pra pegar de volta. Só os 5 primeiros conseguem.',
        color: '#c0392b',
      },
      duration_seconds: 60,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      answers: ['saci', 'saci perere', 'saci-perere'],
      messages: {},
    },
    {
      key: 'mula',
      mechanic: 'digitar',
      rarity: 'comum',
      embed: {
        title: '🔥 Uma mula sem cabeça cruzou o chat',
        description: 'Pra ela não voltar, digita **DOCES OU TRAVESSURAS** rapidinho.',
        color: '#e67e22',
      },
      duration_seconds: 60,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      answers: ['doces ou travessuras', 'doce ou travessura', 'gostosuras ou travessuras'],
      messages: {},
    },
    {
      key: 'curupira',
      mechanic: 'quiz',
      rarity: 'incomum',
      embed: {
        title: '🦶 Enigma do Curupira',
        description:
          'Qual criatura do folclore tem os pés virados pra trás?\n\nClica na resposta certa. Errou, não tenta de novo.',
        color: '#2e8b57',
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: 'a', label: 'Boitatá' },
        { key: 'b', label: 'Curupira' },
        { key: 'c', label: 'Mula sem cabeça' },
      ],
      answers: ['b'],
      messages: {},
    },
    {
      key: 'cuca',
      mechanic: 'quiz',
      rarity: 'incomum',
      embed: {
        title: '🐊 A Cuca quer saber',
        description:
          'Em qual obra a Cuca ficou famosa?\n\nClica na resposta certa. Errou, não tenta de novo.',
        color: '#27ae60',
      },
      duration_seconds: 90,
      slots: 5,
      empty_chance: 0,
      in_activity: true,
      options: [
        { key: 'a', label: 'Sítio do Picapau Amarelo' },
        { key: 'b', label: 'Turma da Mônica' },
        { key: 'c', label: 'Castelo Rá-Tim-Bum' },
      ],
      answers: ['a'],
      messages: {},
    },
    {
      key: 'boitata',
      mechanic: 'escolha_fixa',
      rarity: 'raro',
      embed: {
        title: '🔥🐍 O Boitatá iluminou a mata',
        description: 'Três trilhas acesas. Só uma leva ao doce, e o Boitatá não faz travessura.',
        color: '#ff4500',
      },
      duration_seconds: 120,
      slots: 3,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 15, repeat: 3 },
      in_activity: true,
      options: [
        { key: 'norte', label: 'Trilha norte', emoji: '🌲', outcome: 'empty' },
        { key: 'sul', label: 'Trilha sul', emoji: '🌲', outcome: 'candy' },
        { key: 'leste', label: 'Trilha leste', emoji: '🌲', outcome: 'empty' },
      ],
      messages: { empty: 'A trilha acabou num brejo. Nada de doce.' },
    },
    {
      key: 'abobora-dourada',
      mechanic: 'botao_sorteio',
      rarity: 'raro',
      embed: {
        title: '✨🎃 ABÓBORA DOURADA!',
        description: 'Rara de verdade. Três vagas, sem travessura.',
        color: '#f1c40f',
      },
      duration_seconds: 90,
      slots: 3,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 20, repeat: 5 },
      in_activity: true,
      button_label: 'Pegar a dourada',
      messages: {},
    },
    {
      key: 'abobora-gigante',
      mechanic: 'botao_sorteio',
      rarity: 'raro',
      embed: {
        title: '🎃🎃🎃 ABÓBORA GIGANTE!',
        description: 'Só aparece uma vez por dia. Dez vagas, sem travessura.',
        color: '#ffa500',
      },
      duration_seconds: 180,
      slots: 10,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 25, repeat: 3 },
      in_activity: true,
      max_per_day: 1,
      button_label: 'Abraçar a abóbora',
      messages: {},
    },
    {
      key: 'meia-noite',
      mechanic: 'botao_sorteio',
      rarity: 'raro',
      embed: {
        title: '🕛 Deu meia-noite',
        description: 'O véu entre os mundos tá fino. Os 20 primeiros a clicar levam doce.',
        color: '#4b0082',
      },
      duration_seconds: 300,
      slots: 20,
      trick_chance: 0,
      empty_chance: 0,
      points: { first: 15, repeat: 2 },
      in_activity: false,
      button_label: 'Atravessar o véu',
      messages: {},
    },
  ],
  thread: {
    forum_ids: ['1432911590717657168'],
    allow_preexisting: false,
    min_replies: 5,
    min_distinct_users: 3,
    min_chars: 3,
    reaction_emoji: '🎃',
    max_rewards_per_user: 1,
    reply_message: '🎃 Esse post rendeu conversa! {{USER}} ganhou o cargo do Halloween.',
  },
};

type Cfg = Record<string, any>;
const base = (): Cfg => structuredClone(EVENT_DROPS_HALLOWEEN_2026);
const drop = (c: Cfg, key: string): Cfg => c.drops.find((d: Cfg) => d.key === key);
const mutate = (fn: (c: Cfg) => void): Cfg => {
  const c = base();
  fn(c);
  return c;
};

/** Configs inválidas derivadas do Halloween; `expectPath` é o path do issue esperado. */
export const EVENT_DROPS_INVALID: { name: string; config: Cfg; expectPath: (string | number)[] }[] =
  [
    {
      name: 'escolha sem options',
      config: mutate(c => delete drop(c, 'iara').options),
      expectPath: ['drops', 2, 'options'],
    },
    {
      name: 'escolha_fixa com opção sem outcome',
      config: mutate(c => delete drop(c, 'abobora-podre').options[0].outcome),
      expectPath: ['drops', 1, 'options'],
    },
    {
      name: 'distribution não soma options.length',
      config: mutate(c => (drop(c, 'iara').distribution.candy = 3)),
      expectPath: ['drops', 2, 'distribution'],
    },
    {
      name: 'digitar sem answers',
      config: mutate(c => delete drop(c, 'saci').answers),
      expectPath: ['drops', 5, 'answers'],
    },
    {
      name: 'drop.key duplicado',
      config: mutate(c => (c.drops[1].key = c.drops[0].key)),
      expectPath: ['drops', 1, 'key'],
    },
    {
      name: 'schedule com drop_key inexistente',
      config: mutate(c => (c.schedule[1].drop_key = 'nao-existe')),
      expectPath: ['schedule', 1, 'drop_key'],
    },
    {
      name: 'role_id não é snowflake',
      config: mutate(c => (c.role_id = 'abc')),
      expectPath: ['role_id'],
    },
    {
      name: 'drops vazio',
      config: mutate(c => (c.drops = [])),
      expectPath: ['drops'],
    },
  ];
