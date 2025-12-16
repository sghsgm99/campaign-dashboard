import express from "express";
import cors from "cors";

// Import routes
import campaignRoutes from "./modules/campaign/campaign.routes";
import adgroupRoutes from "./modules/adgroup/adgroup.routes";
import adRoutes from "./modules/ad/ad.routes";
import negtivekeywordRoutes from "./modules/negativekeyword/negativekeyword.routes";

// Initialize Express app
const app = express();

// Enable CORS for specific origin (frontend running on port 3000)
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL (React/Vue running on port 3000)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Middleware for parsing JSON requests
app.use(express.json());

// API Routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/adgroups", adgroupRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/negativekeywords", negtivekeywordRoutes);

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
