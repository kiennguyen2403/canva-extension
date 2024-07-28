import { ContentDraft } from "@canva/design";
import { RichtextRange } from "@canva/preview/design";

export type TextContentDraft = ContentDraft<{ text: string }>;
export type RichTextContentDraft = ContentDraft<RichtextRange>;
