import { z } from 'zod';

declare const MECHANICS: readonly ["botao_sorteio", "escolha", "escolha_fixa", "digitar", "quiz"];
declare const OUTCOMES: readonly ["candy", "trick", "empty"];
declare const RARITIES: readonly ["comum", "incomum", "raro"];
declare const dropOptionSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    emoji: z.ZodOptional<z.ZodString>;
    outcome: z.ZodOptional<z.ZodEnum<{
        candy: "candy";
        trick: "trick";
        empty: "empty";
    }>>;
}, z.core.$strip>;
declare const dropSchema: z.ZodObject<{
    key: z.ZodString;
    mechanic: z.ZodEnum<{
        botao_sorteio: "botao_sorteio";
        escolha: "escolha";
        escolha_fixa: "escolha_fixa";
        digitar: "digitar";
        quiz: "quiz";
    }>;
    rarity: z.ZodDefault<z.ZodEnum<{
        comum: "comum";
        incomum: "incomum";
        raro: "raro";
    }>>;
    embed: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
        footer: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    duration_seconds: z.ZodDefault<z.ZodNumber>;
    slots: z.ZodDefault<z.ZodNumber>;
    trick_chance: z.ZodOptional<z.ZodNumber>;
    empty_chance: z.ZodDefault<z.ZodNumber>;
    points: z.ZodOptional<z.ZodObject<{
        first: z.ZodOptional<z.ZodNumber>;
        repeat: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    in_activity: z.ZodDefault<z.ZodBoolean>;
    max_per_day: z.ZodOptional<z.ZodNumber>;
    button_label: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        emoji: z.ZodOptional<z.ZodString>;
        outcome: z.ZodOptional<z.ZodEnum<{
            candy: "candy";
            trick: "trick";
            empty: "empty";
        }>>;
    }, z.core.$strip>>>;
    distribution: z.ZodOptional<z.ZodObject<{
        candy: z.ZodNumber;
        trick: z.ZodNumber;
        empty: z.ZodNumber;
    }, z.core.$strip>>;
    answers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    messages: z.ZodPrefault<z.ZodObject<{
        candy: z.ZodOptional<z.ZodString>;
        trick: z.ZodOptional<z.ZodString>;
        empty: z.ZodOptional<z.ZodString>;
        late: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const eventDropsConfigSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    timezone: z.ZodDefault<z.ZodString>;
    role_id: z.ZodString;
    staff_channel_id: z.ZodOptional<z.ZodString>;
    event_role_duration: z.ZodDefault<z.ZodEnum<{
        forever: "forever";
        event_end: "event_end";
    }>>;
    points: z.ZodPrefault<z.ZodObject<{
        first: z.ZodDefault<z.ZodNumber>;
        repeat: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    trick_chance: z.ZodDefault<z.ZodNumber>;
    trick: z.ZodOptional<z.ZodObject<{
        role_id: z.ZodString;
        duration_minutes: z.ZodNumber;
    }, z.core.$strip>>;
    anti_abuse: z.ZodPrefault<z.ZodObject<{
        min_member_age_days: z.ZodDefault<z.ZodNumber>;
        excluded_role_ids: z.ZodDefault<z.ZodArray<z.ZodString>>;
        max_candies_per_user_per_day: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
    activity: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        channel_ids: z.ZodArray<z.ZodString>;
        window_seconds: z.ZodDefault<z.ZodNumber>;
        threshold: z.ZodDefault<z.ZodNumber>;
        chance: z.ZodDefault<z.ZodNumber>;
        channel_cooldown_minutes: z.ZodDefault<z.ZodNumber>;
        global_cooldown_minutes: z.ZodDefault<z.ZodNumber>;
        min_message_length: z.ZodDefault<z.ZodNumber>;
        per_user_seconds: z.ZodDefault<z.ZodNumber>;
        rarity_weights: z.ZodPrefault<z.ZodObject<{
            comum: z.ZodDefault<z.ZodNumber>;
            incomum: z.ZodDefault<z.ZodNumber>;
            raro: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    schedule: z.ZodDefault<z.ZodArray<z.ZodObject<{
        at: z.ZodString;
        drop_key: z.ZodString;
        channel_id: z.ZodString;
    }, z.core.$strip>>>;
    drops: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        mechanic: z.ZodEnum<{
            botao_sorteio: "botao_sorteio";
            escolha: "escolha";
            escolha_fixa: "escolha_fixa";
            digitar: "digitar";
            quiz: "quiz";
        }>;
        rarity: z.ZodDefault<z.ZodEnum<{
            comum: "comum";
            incomum: "incomum";
            raro: "raro";
        }>>;
        embed: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            image: z.ZodOptional<z.ZodString>;
            color: z.ZodOptional<z.ZodString>;
            footer: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        duration_seconds: z.ZodDefault<z.ZodNumber>;
        slots: z.ZodDefault<z.ZodNumber>;
        trick_chance: z.ZodOptional<z.ZodNumber>;
        empty_chance: z.ZodDefault<z.ZodNumber>;
        points: z.ZodOptional<z.ZodObject<{
            first: z.ZodOptional<z.ZodNumber>;
            repeat: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        in_activity: z.ZodDefault<z.ZodBoolean>;
        max_per_day: z.ZodOptional<z.ZodNumber>;
        button_label: z.ZodOptional<z.ZodString>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            label: z.ZodString;
            emoji: z.ZodOptional<z.ZodString>;
            outcome: z.ZodOptional<z.ZodEnum<{
                candy: "candy";
                trick: "trick";
                empty: "empty";
            }>>;
        }, z.core.$strip>>>;
        distribution: z.ZodOptional<z.ZodObject<{
            candy: z.ZodNumber;
            trick: z.ZodNumber;
            empty: z.ZodNumber;
        }, z.core.$strip>>;
        answers: z.ZodOptional<z.ZodArray<z.ZodString>>;
        messages: z.ZodPrefault<z.ZodObject<{
            candy: z.ZodOptional<z.ZodString>;
            trick: z.ZodOptional<z.ZodString>;
            empty: z.ZodOptional<z.ZodString>;
            late: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    thread: z.ZodOptional<z.ZodObject<{
        forum_ids: z.ZodArray<z.ZodString>;
        allowed_tag_ids: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allow_preexisting: z.ZodDefault<z.ZodBoolean>;
        min_replies: z.ZodDefault<z.ZodNumber>;
        min_distinct_users: z.ZodDefault<z.ZodNumber>;
        min_chars: z.ZodDefault<z.ZodNumber>;
        reaction_emoji: z.ZodDefault<z.ZodString>;
        max_rewards_per_user: z.ZodDefault<z.ZodNumber>;
        reply_message: z.ZodOptional<z.ZodString>;
        points: z.ZodOptional<z.ZodObject<{
            first: z.ZodOptional<z.ZodNumber>;
            repeat: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type EventDropsConfig = z.infer<typeof eventDropsConfigSchema>;
type DropConfig = z.infer<typeof dropSchema>;
type DropOption = z.infer<typeof dropOptionSchema>;
type Mechanic = (typeof MECHANICS)[number];
type Rarity = (typeof RARITIES)[number];
type Outcome = (typeof OUTCOMES)[number];

export { type DropConfig as D, type EventDropsConfig as E, MECHANICS as M, OUTCOMES as O, RARITIES as R, type DropOption as a, type Mechanic as b, type Outcome as c, type Rarity as d, dropOptionSchema as e, dropSchema as f, eventDropsConfigSchema as g };
