import { GoogleAdsService } from "../../services/GoogleAdsService";
import { CampaignRepository } from "./campaign.repository";
import { CreateCampaignDTO } from "./campaign.types";

export class CampaignService {
  private googleAds = new GoogleAdsService();

  async getAll() {
    return CampaignRepository.findAll();
    //return this.googleAds.getCampaigns();    
  }

  async create(payload: CreateCampaignDTO) {
    const result = "ok"; //await this.googleAds.createCampaign(payload);

    await CampaignRepository.save({
      name: payload.name,
      status: "PAUSED",
      channelType: payload.type,
      budget: payload.budget
    });

    return result;
  }
}
