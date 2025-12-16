import express from "express";
import cors from "cors";

import campaignRoutes from "./modules/campaign/campaign.routes";
import adgroupRoutes from "./modules/adgroup/adgroup.routes";
import adRoutes from "./modules/ad/ad.routes";
import negtivekeywordRoutes from "./modules/negativekeyword/negativekeyword.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/campaigns", campaignRoutes);
app.use("/api/adgroups", adgroupRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/negativekeywords", negtivekeywordRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
