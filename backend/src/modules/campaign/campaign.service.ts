import { GoogleAdsService } from "../../services/GoogleAdsService";
import { CampaignRepository } from "./campaign.repository";
import { CreateCampaignDTO } from "./campaign.types";

export class CampaignService {
  private googleAds = new GoogleAdsService();

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
}
