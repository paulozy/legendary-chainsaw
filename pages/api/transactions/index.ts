import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from "next";
import { gSheets } from "../../../src/services/google";
import { Transaction, TransactionType } from "../../../src/types";
import { extractSpreadsheetId } from '../../../src/utils/extractSpreadsheetId';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { uri } = req.query

    const defaultSpreadsheetId = "18VHeypfw8WCiqNjldT3koGnjPCZzl3fqGHRw8KBIrvg"
    const spreadsheetId = extractSpreadsheetId(uri as string)

    if (defaultSpreadsheetId === spreadsheetId) {
      res.status(403).send({
        error: 'Não é possível importar a planilha modelo'
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
    for (const transaction of transactions) {
      if (transaction.type === TransactionType.EXPENSE) categories.add(transaction.category)
    }

    const json = { transactions, categories: Array.from(categories) }

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
    const noThousands = number.replace(/\./g, '');
    const normalizedNumber = noThousands.replace(/,/g, '.');
    const value = parseFloat(normalizedNumber);

    return {
      id: crypto.randomUUID(),
      type: row[0].toLowerCase(),
      description: row[1],
      value,
      category: row[3],
      date: row[4],
    };
  });

  return json;
};
