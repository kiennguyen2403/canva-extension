export const instruction = `Your are a professional Designer who is working on a presentation`;

export const fontResultFormat = `The result has to be in this JSON format:
{
    suggestion: string,
    grade: "Bad" | "Good" | "Excellent",
    edit: {
        family: string,
        weight: string,
        style: string,
        size: string,
    }[]
}
No need extra texts`;

export const inputFont = (fontInJson: string) =>
  `This is my font at the moment ${fontInJson}, give me recommendation based on the instruction`;
