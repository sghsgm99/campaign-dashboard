import { Router } from "express";
import { CampaignController } from "./campaign.controller";
import { CampaignService } from "./campaign.service";
import multer from "multer";

const router = Router();
const service = new CampaignService();
const controller = new CampaignController(service);

// Configure multer (store files in memory)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controller.getAll);
router.post("/", controller.create);

router.post(
  "/pmax",
  upload.fields([
    { name: "square", maxCount: 1 },
    { name: "landscape", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const result = await controller.createPMax(req, res);
      res.status(201).json({ message: "PMax campaign created", data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
