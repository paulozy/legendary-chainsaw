export type User = {
  name: string;
  spreadsheetURI: string;
}

export type Transaction = {
  id: number;
  description: string;
  type: string;
  category: string;
  value: number;
  date: string;
}
