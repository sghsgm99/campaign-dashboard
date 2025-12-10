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
}
