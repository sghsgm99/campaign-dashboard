import { Request, Response } from "express";
import { AdService } from "./ad.service";
import { CreateAdRequest } from "./ad.types";

export class AdController {
  constructor(private readonly service: AdService) {}

  create = async (req: Request, res: Response) => {
    try {
      const { ads } = req.body as CreateAdRequest;

      if (!Array.isArray(ads)) {
        return res.status(400).json({
          error: "ads must be an array",
        });
      }

      const result = await this.service.create(ads);
      res.status(201).json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Failed to create ad",
        details: error.message,
      });
    }
  };
}
