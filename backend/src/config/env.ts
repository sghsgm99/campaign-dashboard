import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3001,
  CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID!,
  CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  CUSTOMER_ID: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  NODE_ENV: process.env.NODE_ENV || "development"
};
