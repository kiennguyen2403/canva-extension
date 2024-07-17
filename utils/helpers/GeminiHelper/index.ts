import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { instruction, fontResultFormat, inputFont } from "./prompts";

type Font = {
  family: string | null;
  weight: string | null;
  style: string | null;
  size: number | null;
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

  public assessColourPallete(colorPallete: string[]) {}
}

export const geminiHelper = GeminiHelper.getInstance();
