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

## Fixtures de contrato

`VALID_MESSAGES`, `INVALID_MESSAGES`, `VALID_SEND_REQUESTS` e
`INVALID_SEND_REQUESTS` são exportadas no subpath
`@delfus/discord-message-schema/fixtures` para os repos consumidores rodarem
nos próprios testes e detectarem drift de versão.

## Versionamento

Tags semver (`v0.1.0`, ...). Consumidores fixam a tag no install. Mudança de
schema = bump de versão + atualizar a tag nos dois repos (PR coordenado).
