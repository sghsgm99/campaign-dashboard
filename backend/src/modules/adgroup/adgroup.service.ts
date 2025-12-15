import { GoogleAdsService } from "../../services/GoogleAdsService";
import { AdGroupRepository } from "./adgroup.repository";
import { CreateAdGroupDTO } from "./adgroup.types";

export class AdGroupService {
  private googleAds = new GoogleAdsService();

  async getAdGroups(campaignId: string) {
    return AdGroupRepository.findAll(campaignId);
  }

  async create(payload: CreateAdGroupDTO[]) {
    const result = await this.googleAds.createAdGroups(payload);

    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
  
      const adGroupResource = result?.adGroups[i];
      const adGroupId = adGroupResource ? adGroupResource.split('/').pop() : null;
  
      if (!adGroupId) {
        throw new Error("Failed to extract adGroupId from result.");
      }
  
      const adGroupData = {
        googleCampaignId: item.campaignId,
        name: item.name,
        status: "PAUSED" as "PAUSED",
        cpcBid: item.cpcBid,
        type: "SEARCH_STANDARD" as "SEARCH_STANDARD",
        googleAdGroupId: adGroupId,
      };
  
      await AdGroupRepository.save(adGroupData);
    }
  
    return result;
  }
  
}
