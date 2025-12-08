import { GoogleAdsApi } from "google-ads-api";
import { env } from "./env";

export const googleAdsClient = new GoogleAdsApi({
  client_id: env.CLIENT_ID,
  client_secret: env.CLIENT_SECRET,
  developer_token: env.DEVELOPER_TOKEN,
});
