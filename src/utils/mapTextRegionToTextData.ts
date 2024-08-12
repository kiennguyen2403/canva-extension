import { findFonts } from "@canva/asset";
import type { TextRegion } from "@canva/preview/design";
import { TextData } from "src/types/AnalysisData";

export const mapTextRegionToTextData = async ({
  id,
  data,
}: {
  id: number;
  data: TextRegion;
}): Promise<TextData> => {
  const fontRef = data.formatting?.fontRef;
  const fonts = fontRef && (await findFonts({ fontRefs: [fontRef] })).fonts;
  const fontName = fonts && fonts.length > 0 ? fonts[0].name : undefined;

  return {
    id,
    formatting: {
      ...data.formatting,
      strikethrough: data.formatting?.strikethrough == "strikethrough",
      italic: data.formatting?.fontStyle == "italic",
      underline: data.formatting?.decoration == "underline",
      fontName,
    },
    text: data.text,
  };
};
