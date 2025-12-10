import express from "express";
import cors from "cors";

import campaignRoutes from "./routes/campaignRoutes";
import adgroupRoutes from "./routes/adgroupRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/campaigns", campaignRoutes);
app.use("/api/adgroups", adgroupRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
