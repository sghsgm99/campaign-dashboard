import { Request, Response } from "express";
import { GoogleAdsService } from "../services/GoogleAdsService";

const googleAds = new GoogleAdsService();

export class CampaignController {
  static async getAll(req: Request, res: Response) {
    try {
      const campaigns = await googleAds.getCampaigns();
      return res.json(campaigns);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const result = await googleAds.createCampaign(req.body);

      return res.status(201).json({
        message: "Campaign created successfully",
        data: result,
      });
    } catch (err: any) {
      //console.dir(error, { depth: 20 });
      console.error(err);
      return res.status(500).json({
        error: "Failed to create campaign",
        details: err.message,
      });
    }
  }
}
