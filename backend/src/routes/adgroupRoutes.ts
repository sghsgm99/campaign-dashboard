import { Router } from "express";
import { AdgroupController } from "../controllers/AdgroupController";

const router = Router();

// POST /api/adgroups
router.post("/", AdgroupController.createMany);
// GET /api/adgroups/:campaignId
router.get("/:campaignId", AdgroupController.getByCampaignId);

export default router;
