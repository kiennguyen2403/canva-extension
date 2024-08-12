export const getFileFromUrl = async (
  url: string,
  name?: string,
  defaultType = "pdf"
) => {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name || "Untitled", {
    type: data.type || defaultType,
  });
};
