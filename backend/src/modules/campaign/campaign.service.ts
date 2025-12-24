import fs from "fs";
import path from "path";
import sharp from "sharp";
import { GoogleAdsService } from "../../services/GoogleAdsService";
import { CampaignRepository } from "./campaign.repository";
import { CreateCampaignDTO, CreatePMaxCampaignDTO, CreatePMaxCampaignDB } from "./campaign.types";

export class CampaignService {
  private googleAds = new GoogleAdsService();

  private uploadDir = path.join(__dirname, "../../uploads");

  constructor() {
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir, { recursive: true });
  }

  private async saveImage(file: Buffer, type: "square" | "landscape" | "logo") {
    if (!file) return null;

    let width: number, height: number;

    // Set required dimensions
    switch (type) {
      case "square":
        width = 1200;
        height = 1200;
        break;
      case "landscape":
        width = 1200;
        height = 628;
        break;
      case "logo":
        width = 1200;
        height = 300;
        break;
      default:
        throw new Error("Invalid image type");
    }

    // Resize image using sharp
    const filename = `${type}_${Date.now()}.png`;
    const filepath = path.join(this.uploadDir, filename);

    await sharp(file)
      .resize(width, height)
      .png()
      .toFile(filepath);

    return `/uploads/${filename}`;
  }

  async getAll() {
    return CampaignRepository.findAll();
  }

  async create(payload: CreateCampaignDTO) {
    const result = await this.googleAds.createCampaign(payload);

    const campaignResource = result?.campaign;
    if (!campaignResource) {
      throw new Error("Failed to get campaign resource name from result.");
    }
  
    const campaignId = campaignResource.split('/').pop();
    if (!campaignId) {
      throw new Error("Failed to extract campaignId from resource name.");
    }

    await CampaignRepository.save({
      name: payload.name,
      status: "PAUSED",
      channelType: payload.type,
      budget: payload.budget,
      googleCampaignId: campaignId,
      location: payload.location
    });

    return result;
  }

  async createPMaxCampaign(payload: CreatePMaxCampaignDTO) {
    if (!payload.images?.square) {
      throw new Error("Square logo is required for Performance Max campaigns with Brand Guidelines.");
    }

    // Save images
    const imagesUrls: CreatePMaxCampaignDB["images"] = {
      square: await this.saveImage(payload.images.square, "square"),
      landscape: payload.images.landscape ? await this.saveImage(payload.images.landscape, "landscape") : null,
      logo: payload.images.logo ? await this.saveImage(payload.images.logo, "logo") : null,
    };

    console.log('imagesUrls:', imagesUrls);

    // Call Google Ads API
    const result = await this.googleAds.createPerformanceMaxCampaign(payload);

    const campaignResource = result?.campaign;
    if (!campaignResource) throw new Error("No campaign resource returned from Google Ads API.");

    const campaignId = campaignResource.split("/").pop();
    if (!campaignId) throw new Error("Failed to extract campaign ID.");

    // Save to DB
    const dbPayload: CreatePMaxCampaignDB = {
      name: payload.name,
      status: "PAUSED",
      channelType: "PERFORMANCE_MAX",
      budget: payload.budget,
      location: payload.location,
      googleCampaignId: campaignId,
      finalUrl: payload.finalUrl,
      headlines: JSON.stringify(payload.headlines),
      descriptions: JSON.stringify(payload.descriptions),
      images: imagesUrls,
    };

    await CampaignRepository.savePMax(dbPayload);

    return result;
  }

}
