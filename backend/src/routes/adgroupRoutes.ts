import { Router } from "express";
import { AdgroupController } from "../controllers/AdgroupController";

const router = Router();

// POST /api/adgroups
router.post("/", AdgroupController.createMany);

export default router;
