import { Request, Response } from "express";
import { NegativeKeywordService } from "./negativekeyword.service";
import { CreateNegativeKeywordRequest } from "./negativekeyword.types";

export class NegativeKeywordController {
  constructor(private readonly service: NegativeKeywordService) {}

  create = async (req: Request, res: Response) => {
    try {
      const { negativeKeywords } = req.body as CreateNegativeKeywordRequest;

      if (!Array.isArray(negativeKeywords)) {
        return res.status(400).json({
          error: "negativekeywords must be an array",
        });
      }

      const result = await this.service.create(negativeKeywords);
      res.status(201).json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Failed to create negativekeyword",
        details: error.message,
      });
    }
  };
}
