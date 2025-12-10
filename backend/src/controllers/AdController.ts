import { Request, Response } from "express";
import { GoogleAdsService } from "../services/GoogleAdsService";

const googleAds = new GoogleAdsService();

export class AdController {
  static async createMany(req: Request, res: Response) {
    try {
      const { ads } = req.body;
  
      if (!Array.isArray(ads) || ads.length === 0) {
        return res.status(400).json({ error: "ads must be a non-empty array" });
      }
  
      const result = await googleAds.createAds(ads);
  
      return res.status(201).json({
        message: "Ads created successfully",
        data: result,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to create ads",
        details: err.message,
      });
    }
  }  
}
