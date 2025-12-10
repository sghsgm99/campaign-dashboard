import { Router } from "express";
import { AdController } from "../controllers/AdController";

const router = Router();

// POST /api/ads
router.post("/", AdController.createMany);

export default router;
