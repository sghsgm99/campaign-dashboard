import { Request, Response } from "express";
import { CampaignService } from "./campaign.service";

export class CampaignController {
  constructor(private readonly service: CampaignService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const campaigns = await this.service.getAll();
      res.json(campaigns);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const campaign = await this.service.create(req.body);
      res.status(201).json({
        message: "Campaign created successfully",
        data: campaign,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Failed to create campaign",
        details: error.message,
      });
    }
  };
}
