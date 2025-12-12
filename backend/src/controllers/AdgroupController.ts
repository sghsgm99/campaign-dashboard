import { Request, Response } from "express";
import { GoogleAdsService } from "../services/GoogleAdsService";

const googleAds = new GoogleAdsService();

export class AdgroupController {
  static async createMany(req: Request, res: Response) {
    try {
      const { adGroups } = req.body;
  
      if (!Array.isArray(adGroups) || adGroups.length === 0) {
        return res.status(400).json({ error: "adGroups must be a non-empty array" });
      }
  
      const result = await googleAds.createAdGroups(adGroups);
  
      return res.status(201).json({
        message: "Ad groups created successfully",
        data: result,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to create ad groups",
        details: err.message,
      });
    }
  }

  static async getByCampaignId(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;
  
      const adgroups = await googleAds.getAdGroups(campaignId);

      return res.json(adgroups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to load ad groups" });
    }
  }  
}
