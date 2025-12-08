import { Router } from "express";
import { CampaignController } from "../controllers/CampaignController";

const router = Router();

router.get("/", CampaignController.getAll);
router.post("/", CampaignController.create);

export default router;
