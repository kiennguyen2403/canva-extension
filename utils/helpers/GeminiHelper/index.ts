import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import {
  instruction,
  fontResultFormat,
  inputFont,
  inputColourPallete,
  typeInstruction,
  fontOutput,
} from "./prompts";

type Font = {
  formatting: {
    color: string;
    underline: boolean;
    fontName: string;
    fontSize: number;
    italic: boolean;
    fontWeight: string[];
    link: string;
    listLevel: number;
    listMarker: string;
    strikethrough: boolean;
    textAlign: string;
  };
  text: string;
}[];

class GeminiHelper {
  private static instance: GeminiHelper;

  private constructor(private model: GenerativeModel) {}

  public static getInstance(): GeminiHelper {
    if (!GeminiHelper.instance) {
      GeminiHelper.instance = new GeminiHelper(
        new GoogleGenerativeAI(process.env.GEMINI_API_KEY!).getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
        })
      );
    }
    return GeminiHelper.instance;
  }

  public async assessFont(font: Font) {
    const fontInJSON = JSON.stringify(font);
    const result = await this.model.generateContent({
      contents: [
        {
          parts: [
            {
              text: instruction,
            },
            { text: fontResultFormat },
            { text: typeInstruction },
            { text: fontOutput },
          ],
          role: "modal",
        },
        {
          parts: [{ text: inputFont(fontInJSON) }],
          role: "user",
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0,
      },
    });
    console.log(result);
    return result;
  }

  public async assessColourPallete(colorPallete: string[]) {
    const colourPalleteInString = JSON.stringify(colorPallete);
    const result = await this.model.generateContent({
      contents: [
        {
          parts: [
            {
              text: instruction,
            },
          ],
          role: "modal",
        },
        {
          parts: [{ text: inputColourPallete(colourPalleteInString) }],
          role: "user",
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0,
      },
    });
    console.log(result);
    return result.response.text;
  }
}

export const geminiHelper = GeminiHelper.getInstance();
