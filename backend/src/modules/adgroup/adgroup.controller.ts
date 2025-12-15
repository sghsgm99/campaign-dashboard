import { Request, Response } from "express";
import { AdGroupService } from "./adgroup.service";

export class AdGroupController {
  constructor(private readonly service: AdGroupService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const adgroups = await this.service.getAll();
      res.json(adgroups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch adgroups" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const adgroup = await this.service.create(req.body);
      res.status(201).json({
        message: "Adgroup created successfully",
        data: adgroup,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Failed to create adgroup",
        details: error.message,
      });
    }
  };
}
