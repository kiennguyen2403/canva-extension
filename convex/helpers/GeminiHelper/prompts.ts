export const instruction = `Your are a professional Designer who is working on a poster`;

export const fontResultFormat =
  "You are assisting in developing an extension for Canva that analyzes and categorizes designs by font, color palette and content. A user has uploaded a design, and your task is to provide a detailed analysis. Specifically, identify the following: 1. The fonts used in the design, including their names and any noticeable characteristics (e.g., serif, sans-serif, bold, italic). 2. The color palette of the design, listing the primary colors used along with their HEX or RGB values. 3. Any patterns or themes in the use of colors and fonts (e.g., consistent use of a specific color for headings, complementary color schemes). 4. The content of the poster (e.g too long, too general, not suitable,...). Return the analysis in JSON format with the following fields: - 'mark': A score or evaluation of the design based on font, color usage, content. - 'feedback': Detailed feedback on the font, color choices and contents. - 'recommendation': Suggestions for improvement or alternative design choices. Ensure the output is structured clearly and concisely.";
export const typeInstruction = `The type of input will look like this:\n {
   formatting: {
     color: string;
     underline: boolean;
     fontName: string;
     fontSize: number;
     italic: boolean;
     fontWeight: FontWeight;
     link: string;
     listLevel: number;
     listMarker: "none" | "disc" | "circle" | "square" | "decimal" | "lower-alpha" | "lower-roman" | "checked" | "unchecked";
     strikethrough: boolean;
     textAlign: "start" | "center" | "end" | "justify";
   };
   text: string;
}`;

export const fontOutput = `
Please organise it in the the following JSON format in the following sequence: \n\n 
{
  "grade": {
    "overall": string;
    "syntaxAndCorrectness": string;
  },
  "feedbacks": string[],
  "recommendations": string[],
}
\n\n
Please return only the JSON, I don't want any extra text including the word JSON.
`;

export const wordingOutput = `
Please organise it in the the following JSON format in the following sequence: \n\n 
{
  "grade": {
    "overall": string;
    "syntaxAndCorrectness": string;
  },
  "feedbacks": string[],
  "recommendations": string[],
}
  \n\n
Please return only the JSON, I don't want any extra text including the word JSON.
`;

export const colourPalleteOutput = `
Please organise it in the the following JSON format in the following sequence: \n\n 
{
  "grade": {
    "overall": string;
    "syntaxAndCorrectness": string;
  },
  "feedbacks": string[],
  "recommendations": string[],
}
  \n\n
Please return only the JSON, I don't want any extra text including the word JSON.
`;


export const inputFont = (fontInJson: string) =>
  `This is my font at the moment ${fontInJson}, give me recommendation based on the instruction`;

export const inputColourPallete = (colourPalleteInJson: string) => {
  return `This is my font at the moment ${colourPalleteInJson}, give me recommendation based on the instruction`;
};

export const inputWording = (wordingInJson: string) => {
  return `This is the content of the 1-page poster at the moment ${wordingInJson}, give me recommendation based on the instruction`;
}
