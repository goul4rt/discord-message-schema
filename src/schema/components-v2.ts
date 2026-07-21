/**
 * Discord Components V2 (message flag 1 << 15).
 *
 * Modela os tipos que o bot já emite hoje em código (painel /familia, painel
 * /backup, ranking ao vivo) para que virem DADO editável no painel web.
 *
 * Regras do Discord que o contrato carrega:
 *  - mensagem com a flag V2 NÃO aceita `content` nem `embeds`;
 *  - a flag é IMUTÁVEL depois de enviada: trocar de V1 para V2 (ou o inverso)
 *    exige apagar a mensagem e repostar, não dá para editar;
 *  - container não aninha container (um nível só).
 *
 * Não há recursão aqui de propósito — o Discord permite apenas um nível de
 * container, então uma união simples resolve sem `z.lazy`.
 */
import { z } from 'zod';
import { LIMITS } from '../limits';
import { urlSchema } from './embed';
import { actionRowSchema } from './components';

/** `unfurled media item` da API — só a URL importa no nosso uso. */
export const mediaItemSchema = z.object({ url: urlSchema });

/** type 10 — bloco de texto markdown. O conteúdo real das mensagens V2. */
export const textDisplaySchema = z.object({
  type: z.literal(10),
  content: z.string().min(1).max(LIMITS.V2_TEXT_DISPLAY_MAX),
});

/** type 11 — imagem pequena, só como acessório de uma section. */
export const thumbnailSchema = z.object({
  type: z.literal(11),
  media: mediaItemSchema,
  description: z.string().max(1024).optional(),
  spoiler: z.boolean().optional(),
});

/** type 14 — espaçador, com ou sem linha divisória. */
export const separatorSchema = z.object({
  type: z.literal(14),
  divider: z.boolean().optional(),
  /** 1 = pequeno, 2 = grande. */
  spacing: z.union([z.literal(1), z.literal(2)]).optional(),
});

/** type 12 — grade de imagens. */
export const mediaGallerySchema = z.object({
  type: z.literal(12),
  items: z
    .array(
      z.object({
        media: mediaItemSchema,
        description: z.string().max(1024).optional(),
        spoiler: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(LIMITS.V2_GALLERY_ITEMS_MAX),
});

/** type 9 — texto com um acessório à direita (thumbnail ou botão). */
export const sectionSchema = z.object({
  type: z.literal(9),
  components: z
    .array(textDisplaySchema)
    .min(1)
    .max(LIMITS.V2_SECTION_TEXTS_MAX),
  accessory: thumbnailSchema,
});

/** Tudo que pode viver dentro de um container (type 17). */
export const containerSubComponentSchema = z.union([
  textDisplaySchema,
  sectionSchema,
  separatorSchema,
  mediaGallerySchema,
  actionRowSchema,
]);

/** type 17 — cartão com barra colorida à esquerda. O "embed" do V2. */
export const containerSchema = z.object({
  type: z.literal(17),
  components: z
    .array(containerSubComponentSchema)
    .min(1)
    .max(LIMITS.V2_CONTAINER_CHILDREN_MAX),
  accent_color: z.number().int().min(0).max(LIMITS.EMBED_COLOR_MAX).optional(),
  spoiler: z.boolean().optional(),
});

/** Componentes aceitos na raiz de uma mensagem V2. */
export const componentV2Schema = z.union([
  containerSchema,
  textDisplaySchema,
  sectionSchema,
  separatorSchema,
  mediaGallerySchema,
  actionRowSchema,
]);

export type MediaItem = z.infer<typeof mediaItemSchema>;
export type TextDisplay = z.infer<typeof textDisplaySchema>;
export type Thumbnail = z.infer<typeof thumbnailSchema>;
export type Separator = z.infer<typeof separatorSchema>;
export type MediaGallery = z.infer<typeof mediaGallerySchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Container = z.infer<typeof containerSchema>;
export type ComponentV2 = z.infer<typeof componentV2Schema>;

/** `true` se o componente é V2 (qualquer coisa que não seja action row). */
export function isComponentV2(component: { type: number }): boolean {
  return component.type !== 1;
}

/**
 * Soma dos caracteres de todo text display da árvore — o Discord tem um teto
 * agregado para mensagens V2, análogo aos 6000 chars dos embeds.
 */
export function componentsV2TotalChars(components: ComponentV2[]): number {
  let total = 0;
  for (const component of components) {
    if (component.type === 10) total += component.content.length;
    else if (component.type === 9) {
      for (const text of component.components) total += text.content.length;
    } else if (component.type === 17) {
      for (const child of component.components) {
        if (child.type === 10) total += child.content.length;
        else if (child.type === 9) {
          for (const text of child.components) total += text.content.length;
        }
      }
    }
  }
  return total;
}
