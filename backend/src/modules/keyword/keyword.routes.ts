import { Router } from "express";
import { KeywordController } from "./keyword.controller";
import { KeywordService } from "./keyword.service";

const router = Router();
const service = new KeywordService();
const controller = new KeywordController(service);

router.get("/", controller.getAll);

export default router;
