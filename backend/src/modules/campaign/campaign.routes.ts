import { Router } from "express";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";

const router = Router();
const service = new CampaignService();
const controller = new CampaignController(service);

router.get("/", controller.getAll);
router.post("/", controller.create);

export default router;
