import { Router } from "express";
import { AdController } from "./ad.controller";
import { AdService } from "./ad.service";

const router = Router();
const service = new AdService();
const controller = new AdController(service);

router.post("/", controller.create);

export default router;
