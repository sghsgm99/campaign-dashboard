import { Request, Response } from "express";
import { AdGroupService } from "./adgroup.service";
import { CreateAdGroupRequest } from "./adgroup.types";

export class AdGroupController {
  constructor(private readonly service: AdGroupService) {}

  getByCampaignId = async (_req: Request, res: Response) => {
    try {
      const { campaignId } = _req.params;

      const adgroups = await this.service.getAdGroups(campaignId);
      res.json(adgroups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch adgroups" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { adGroups } = req.body as CreateAdGroupRequest;

      if (!Array.isArray(adGroups)) {
        return res.status(400).json({
          error: "adgroups must be an array",
        });
      }

      const result = await this.service.create(adGroups);
      res.status(201).json(result);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Failed to create adgroup",
        details: error.message,
      });
    }
  };
}
