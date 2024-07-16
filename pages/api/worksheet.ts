import { google } from "googleapis";
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from "next";
import { getEnv } from "../../config/envs";
import { Transaction, TransactionType } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {uri} = req.query
    const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

    const env = getEnv();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.googleAuthClientEmail,
        private_key: env.googleAuthPrivateKey,
      },
      scopes: SCOPES,
    });

    const gSheets = google.sheets({ version: "v4", auth });

    const defaultSpreadsheetId = "18VHeypfw8WCiqNjldT3koGnjPCZzl3fqGHRw8KBIrvg"
    const spreadsheetId = extractSpreadsheetId(uri as string)

    if(defaultSpreadsheetId === spreadsheetId) {
      res.status(403).send({
        error: 'Não é possivel importar a planilha modelo'
      })
    }


    const worksheet = await gSheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Geral!A:E",
    });

    let transactions: Transaction[] = toJSON(worksheet.data.values)

    transactions.sort((a, b) => {
        const aDate = moment(new Date(a.date)).unix()
        const bDate = moment(new Date(b.date)).unix()

        return aDate - bDate
    }).reverse()

    const categories = new Set()
    for(const transaction of transactions) {
      if(transaction.type === TransactionType.EXPENSE) categories.add(transaction.category)
    }

    const json = {transactions, categories: Array.from(categories)}

    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const toJSON = (rows: any) => {
  //remove the header
  rows.shift();

  const json = rows.map((row: any) => {
    let number = row[2].replace(/[^\d,.-]/g, '');
    number.replace(',', '.');
    number = number.replace(/\./g, '');

    number = parseFloat(number);

    return {
      id: crypto.randomUUID(),
      type: row[0].toLowerCase(),
      description: row[1],
      value: number,
      category: row[3],
      date: row[4],
    };
  });

  return json;
};

const extractSpreadsheetId = (url: string) => {
  const pattern = /\/d\/([a-zA-Z0-9-_]+)\//;
  const match = url.match(pattern);
  return match ? match[1] : null;
}