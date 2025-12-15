import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3001,
  CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID!,
  CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  CUSTOMER_ID: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  NODE_ENV: process.env.NODE_ENV || "development",

  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_NAME: process.env.DB_NAME || "",
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_CONNECTION_LIMIT: Number(process.env.DB_CONNECTION_LIMIT || 10),
};
