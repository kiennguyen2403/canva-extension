export function cleanText(text: string): string {
  // Remove newline characters
  let cleanedText = text.replace(/\n/g, " ");

  // Remove carriage return characters
  cleanedText = cleanedText.replace(/\r/g, "");

  // Replace multiple spaces with a single space
  cleanedText = cleanedText.replace(/\s\s+/g, " ");

  // Trim leading and trailing whitespace
  cleanedText = cleanedText.trim();

  return cleanedText;
}
