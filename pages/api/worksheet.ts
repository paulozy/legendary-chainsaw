import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";
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

    const spreadsheetId = extractSpreadsheetId(req.query.uri as string)

    const worksheet = await gSheets.spreadsheets.values.get({
      spreadsheetId,
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

const extractSpreadsheetId = (url: string) => {
  const pattern = /\/d\/([a-zA-Z0-9-_]+)\//;
  const match = url.match(pattern);
  return match ? match[1] : null;
}