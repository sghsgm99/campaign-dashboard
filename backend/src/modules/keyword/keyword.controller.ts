import { Request, Response } from "express";
import { KeywordService } from "./keyword.service";

export class KeywordController {
  constructor(private readonly service: KeywordService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const keywords = await this.service.getAll();
      res.json(keywords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch keywords" });
    }
  };
}
