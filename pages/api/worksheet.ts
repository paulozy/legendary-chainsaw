// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { getEnv } from "../../config/envs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
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
    const worksheet = await gSheets.spreadsheets.values.get({
      spreadsheetId: "12iOevbVBhfuBq62oAj-cgTYlwAIqpuU4j6cEzpbwBb0",
      range: "Geral!A:E",
    });

    res.status(200).json(toJSON(worksheet.data.values));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const toJSON = (rows: any) => {
  //remove the header
  rows.shift();

  const json = rows.map((row: any) => {
    return {
      type: row[0],
      description: row[1],
      value: row[2],
      category: row[3],
      date: row[4],
    };
  });

  return json;
};
