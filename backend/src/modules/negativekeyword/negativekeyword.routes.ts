import { Router } from "express";
import { NegativeKeywordController } from "./negativekeyword.controller";
import { NegativeKeywordService } from "./negativekeyword.service";

const router = Router();
const service = new NegativeKeywordService();
const controller = new NegativeKeywordController(service);

router.post("/", controller.create);

export default router;
