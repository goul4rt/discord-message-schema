# @delfus/discord-message-schema

Contrato compartilhado entre o painel Delfus (front-end) e o discord-bot para
mensagens ricas do Discord: schemas Zod, limites oficiais, placeholders e wire
types do endpoint de envio.

Os schemas são um port adaptado do
[embed-generator](https://github.com/merlinfuchs/embed-generator) de Merlin
Fuchs (MIT) — atribuição mantida em `LICENSE`.

## Instalação

Via git tag (o `prepare` script builda no install):

```bash
npm install github:goul4rt/discord-message-schema#v0.1.0
```

Requer `zod@^4` no projeto consumidor (peer dependency).

## Uso

```ts
import {
  messageSchema,
  sendMessageRequestSchema,
  LIMITS,
  PLACEHOLDERS,
  resolvePlaceholders,
} from '@delfus/discord-message-schema';

// Validar uma mensagem do editor
const result = messageSchema.safeParse(payload);

// Validar o request no bot antes de tocar no Discord
const request = sendMessageRequestSchema.parse(body);

// Resolver placeholders no envio
const resolved = resolvePlaceholders(request.data, {
  server: guild.name,
  memberCount: String(guild.memberCount),
  serverIcon: guild.iconURL() ?? '',
});
```

## Escopo v1

- content (máx 2000), até 10 embeds, até 5 action rows
- **Somente botões de link** são aceitos em components; botões de ação e
  select menus estão descritos no schema (reservados para a feature de actions)
  mas são rejeitados
- `username`/`avatar_url` só no modo `webhook`

## Components V2 (v0.2.0)

Mensagem com a flag `LIMITS.FLAG_COMPONENTS_V2` (32768) troca de contrato:

- **não** aceita `content` nem `embeds` — só `components`
- raiz aceita container (17), text display (10), section (9), separator (14),
  media gallery (12) e action row (1); até 10 componentes
- container não aninha container (o Discord permite um nível só)
- teto agregado de `LIMITS.V2_TOTAL_CHARS_MAX` caracteres somando todo text
  display da árvore — use `componentsV2TotalChars()`

**A flag é imutável depois de enviada.** Trocar uma mensagem de V1 para V2 (ou
o inverso) exige apagar e repostar; `message.edit()` falha. Quem consome
precisa comparar a flag da mensagem existente com a do payload antes de editar.

## Fixtures de contrato

`VALID_MESSAGES`, `INVALID_MESSAGES`, `VALID_SEND_REQUESTS` e
`INVALID_SEND_REQUESTS` são exportadas no subpath
`@delfus/discord-message-schema/fixtures` para os repos consumidores rodarem
nos próprios testes e detectarem drift de versão.

## Eventos de drops (v0.7.0)

`eventDropsConfigSchema` (zod 4) é a fonte única da config de eventos de drops
(`GuildEvent.config`), compartilhada por bot e painel. Exporta também
`MECHANICS`, `OUTCOMES`, `RARITIES`, `dropSchema`, `dropOptionSchema` e os tipos
`EventDropsConfig`, `DropConfig`, `DropOption`, `Outcome`, `Mechanic`, `Rarity`.

Os `superRefine` emitem issues com `path` (`['drops', i, 'options' | 'distribution' | 'answers']`,
`['drops', i, 'key']` para duplicado, `['schedule', i, 'drop_key']`), para mapear a campo de formulário.

Fixtures (subpath `/fixtures`): `EVENT_DROPS_HALLOWEEN_2026` (config crua),
`EVENT_DROPS_HALLOWEEN_2026_PARSED` (saída do parse, com defaults) e
`EVENT_DROPS_INVALID` (`{ name, config, expectPath }`).

## Versionamento

Tags semver (`v0.1.0`, ...). Consumidores fixam a tag no install. Mudança de
schema = bump de versão + atualizar a tag nos dois repos (PR coordenado).
