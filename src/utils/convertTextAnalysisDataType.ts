import { DesignInput, DesignInputName } from "src/types/Convex";
import { TextAnalysisData } from "src/types/AnalysisData";

export const convertTextAnalysisDataType = (data: TextAnalysisData[]): DesignInput => {
  const res = {
    naming: "suggestion",
    components: data.reduce((result: DesignInput["components"], { styles, fullText }) => {
      const baseComponent = {
        name: DesignInputName.Text,
        props: [{ key: "text", value: fullText }],
      };
      const components: DesignInput["components"] = styles.map(({ formatting, text }) => {
        const {
          color,
          underline,
          fontName,
          fontSize,
          italic,
          fontWeight,
          link,
          listLevel,
          listMarker,
          strikethrough,
          textAlign,
        } = formatting || {};

        const formattingProps = formatting
          ? [
              { key: "color", value: color },
              { key: "underline", value: underline },
              { key: "fontName", value: fontName },
              { key: "fontSize", value: fontSize },
              { key: "italic", value: italic },
              { key: "fontWeight", value: [fontWeight] },
              { key: "link", value: link },
              { key: "listLevel", value: listLevel },
              { key: "listMarker", value: listMarker },
              { key: "textAlign", value: textAlign },
              { key: "strikethrough", value: strikethrough },
            ]
          : [];
        return {
          name: DesignInputName.TextFont,
          props: [{ key: "text", value: text }, ...formattingProps],
        };
      });
      components.push(baseComponent);

      return [...result, ...components];
    }, []),
  };
  return res;
};
