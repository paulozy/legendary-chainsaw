import { NextApiRequest, NextApiResponse } from "next";
import { gSheets } from "../../../../src/services/google";
import { Transaction } from "../../../../src/types";
import { extractSpreadsheetId } from "../../../../src/utils/extractSpreadsheetId";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { transaction, spreadsheetUrl } = req.body

    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl)
    const transactionAsSheetType = toSheetType(transaction)

    const payload = {
      spreadsheetId,
      range: "Geral!A:E",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: { values: [transactionAsSheetType] }
    }

    const { data } = await gSheets.spreadsheets.values.append(payload)

    res.status(201).json({ data })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

const toSheetType = (transaction: Transaction) => {
  return [
    transaction.type,
    transaction.description,
    transaction.value,
    transaction.category,
    transaction.date
  ]
}