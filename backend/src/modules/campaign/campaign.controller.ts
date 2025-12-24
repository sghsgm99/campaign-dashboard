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
      console.dir(error, { depth: 3 });
      res.status(500).json({
        error: "Failed to create campaign",
        details: error.message,
      });
    }
  };

  createPMax = async (req: Request, res: Response) => {
    try {
      const files = req.files as {
        square?: Express.Multer.File[];
        landscape?: Express.Multer.File[];
        logo?: Express.Multer.File[];
      };

      const payload = {
        name: req.body.name,
        budget: Number(req.body.budget),
        type: "PERFORMANCE_MAX" as "PERFORMANCE_MAX",
        location: req.body.location,
        finalUrl: req.body.finalUrl,
        headlines: JSON.parse(req.body.headlines || "[]"),
        descriptions: JSON.parse(req.body.descriptions || "[]"),
        images: {
          square: files?.square?.[0]?.buffer,
          landscape: files?.landscape?.[0]?.buffer,
          logo: files?.logo?.[0]?.buffer,
        },
      };

      // optional: validate images
      if (!payload.images.square || !payload.images.landscape) {
        return res.status(400).json({
          error: "Square and landscape images are required for Performance Max",
        });
      }

      const campaign = await this.service.createPMaxCampaign(payload);

      res.status(201).json({
        message: "Performance Max campaign created successfully",
        data: campaign,
      });
    } catch (error: any) {
      console.dir(error, {depth: 5});
      res.status(500).json({
        error: "Failed to create PMax campaign",
        details: error.message,
      });
    }
  };
  
}
