import { Router } from "express";
import { AdGroupController } from "./adgroup.controller";
import { AdGroupService } from "./adgroup.service";

const router = Router();
const service = new AdGroupService();
const controller = new AdGroupController(service);

router.post("/", controller.create);
router.get("/:campaignId", controller.getByCampaignId);

export default router;
