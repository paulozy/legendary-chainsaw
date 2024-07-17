import { google } from "googleapis";
import { getEnv } from "../../../config/envs";

const env = getEnv();
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: env.googleAuthClientEmail,
    private_key: env.googleAuthPrivateKey,
  },
  scopes: SCOPES,
});

export const gSheets = google.sheets({ version: "v4", auth });