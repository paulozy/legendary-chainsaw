export const extractSpreadsheetId = (url: string) => {
  const pattern = /\/d\/([a-zA-Z0-9-_]+)\//;
  const match = url.match(pattern);
  return match ? match[1] : null;
}