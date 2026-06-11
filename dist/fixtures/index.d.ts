/**
 * Contract fixtures: both consumer repos run these through the schemas in
 * their own test suites to detect version drift.
 */
declare const VALID_MESSAGES: readonly [{
    readonly name: "mensagem mínima (só content)";
    readonly message: {
        readonly content: "Olá, mundo!";
    };
}, {
    readonly name: "mensagem completa (content + 2 embeds + botões de link + mentions)";
    readonly message: {
        readonly content: "Confira as novidades do {{server}}!";
        readonly embeds: readonly [{
            readonly title: "Regras do servidor";
            readonly description: "Leia **com atenção** antes de participar.";
            readonly url: "https://delfus.app/regras";
            readonly color: 5793266;
            readonly timestamp: "2026-06-11T12:00:00.000Z";
            readonly author: {
                readonly name: "Equipe Delfus";
                readonly icon_url: "{{serverIcon}}";
            };
            readonly footer: {
                readonly text: "Atualizado em junho de 2026";
            };
            readonly thumbnail: {
                readonly url: "{{serverIcon}}";
            };
            readonly fields: readonly [{
                readonly name: "Respeito";
                readonly value: "Trate todos bem.";
                readonly inline: true;
            }, {
                readonly name: "Spam";
                readonly value: "Proibido flood.";
                readonly inline: true;
            }];
        }, {
            readonly description: "Somos {{memberCount}} membros!";
            readonly image: {
                readonly url: "https://delfus.app/banner.png";
            };
            readonly color: 5763719;
        }];
        readonly components: readonly [{
            readonly type: 1;
            readonly components: readonly [{
                readonly type: 2;
                readonly style: 5;
                readonly label: "Site";
                readonly url: "https://delfus.app";
            }, {
                readonly type: 2;
                readonly style: 5;
                readonly emoji: {
                    readonly name: "📖";
                };
                readonly url: "https://delfus.app/docs";
            }];
        }];
        readonly allowed_mentions: {
            readonly parse: readonly ["users"];
        };
    };
}, {
    readonly name: "mensagem de webhook (username + avatar customizados)";
    readonly message: {
        readonly content: "Anúncio oficial!";
        readonly username: "Delfus News";
        readonly avatar_url: "https://delfus.app/news.png";
    };
}];
declare const VALID_SEND_REQUESTS: readonly [{
    readonly name: "envio modo bot";
    readonly request: {
        readonly mode: "bot";
        readonly channelId: "123456789012345678";
        readonly data: {
            readonly content: "oi";
        };
    };
}, {
    readonly name: "envio modo webhook com remetente customizado";
    readonly request: {
        readonly mode: "webhook";
        readonly channelId: "123456789012345678";
        readonly data: {
            readonly content: "oi";
            readonly username: "Delfus News";
        };
    };
}, {
    readonly name: "edição modo webhook (messageId + webhookId)";
    readonly request: {
        readonly mode: "webhook";
        readonly channelId: "123456789012345678";
        readonly messageId: "876543210987654321";
        readonly webhookId: "111111111111111111";
        readonly data: {
            readonly embeds: readonly [{
                readonly title: "Editado";
            }];
        };
    };
}];

declare const INVALID_MESSAGES: readonly [{
    readonly name: "mensagem vazia";
    readonly message: {};
}, {
    readonly name: "content acima de 2000 chars";
    readonly message: {
        readonly content: string;
    };
}, {
    readonly name: "11 embeds";
    readonly message: {
        readonly embeds: {
            title: string;
        }[];
    };
}, {
    readonly name: "embed vazio";
    readonly message: {
        readonly embeds: readonly [{}];
    };
}, {
    readonly name: "field sem name";
    readonly message: {
        readonly embeds: readonly [{
            readonly fields: readonly [{
                readonly name: "";
                readonly value: "x";
            }];
        }];
    };
}, {
    readonly name: "cor fora do range";
    readonly message: {
        readonly embeds: readonly [{
            readonly title: "x";
            readonly color: 16777216;
        }];
    };
}, {
    readonly name: "total de embeds acima de 6000 chars";
    readonly message: {
        readonly embeds: readonly [{
            description: string;
        }, {
            description: string;
        }];
    };
}, {
    readonly name: "botão de ação (style 1) na v1";
    readonly message: {
        readonly components: readonly [{
            readonly type: 1;
            readonly components: readonly [{
                readonly type: 2;
                readonly style: 1;
                readonly label: "x";
                readonly custom_id: "id";
            }];
        }];
    };
}, {
    readonly name: "select menu na v1";
    readonly message: {
        readonly components: readonly [{
            readonly type: 1;
            readonly components: readonly [{
                readonly type: 3;
                readonly custom_id: "sel";
                readonly options: readonly [{
                    readonly label: "A";
                    readonly value: "a";
                }];
            }];
        }];
    };
}, {
    readonly name: "username proibido";
    readonly message: {
        readonly content: "x";
        readonly username: "Discord Bot";
    };
}, {
    readonly name: "url inválida em image";
    readonly message: {
        readonly embeds: readonly [{
            readonly image: {
                readonly url: "nope";
            };
        }];
    };
}, {
    readonly name: "title vazio com outro campo presente";
    readonly message: {
        readonly embeds: readonly [{
            readonly title: "";
            readonly description: "x";
        }];
    };
}, {
    readonly name: "url com protocolo proibido mascarado por placeholder";
    readonly message: {
        readonly embeds: readonly [{
            readonly image: {
                readonly url: "javascript:alert(1){{serverIcon}}";
            };
        }];
    };
}, {
    readonly name: "allowed_mentions parse users + lista users explícita";
    readonly message: {
        readonly content: "x";
        readonly allowed_mentions: {
            readonly parse: readonly ["users"];
            readonly users: readonly ["123456789012345678"];
        };
    };
}];
declare const INVALID_SEND_REQUESTS: readonly [{
    readonly name: "username no modo bot";
    readonly request: {
        readonly mode: "bot";
        readonly channelId: "123456789012345678";
        readonly data: {
            readonly content: "x";
            readonly username: "Delfus News";
        };
    };
}, {
    readonly name: "channelId que não é snowflake";
    readonly request: {
        readonly mode: "bot";
        readonly channelId: "geral";
        readonly data: {
            readonly content: "x";
        };
    };
}, {
    readonly name: "data inválido (mensagem vazia)";
    readonly request: {
        readonly mode: "bot";
        readonly channelId: "123456789012345678";
        readonly data: {};
    };
}, {
    readonly name: "edição webhook sem webhookId";
    readonly request: {
        readonly mode: "webhook";
        readonly channelId: "123456789012345678";
        readonly messageId: "876543210987654321";
        readonly data: {
            readonly content: "editado";
        };
    };
}];

export { INVALID_MESSAGES, INVALID_SEND_REQUESTS, VALID_MESSAGES, VALID_SEND_REQUESTS };
