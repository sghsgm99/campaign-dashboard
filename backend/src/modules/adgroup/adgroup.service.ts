import { GoogleAdsService } from "../../services/GoogleAdsService";
import { AdGroupRepository } from "./adgroup.repository";
import { CreateAdGroupDTO } from "./adgroup.types";
import { KeywordRepository } from "../keyword/keyword.repository";

export class AdGroupService {
  private googleAds = new GoogleAdsService();

  async getAll() {
    return AdGroupRepository.getAll();
  }

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
        keywords: item.keywords
      };
  
      const adGroupIdFromDB = await AdGroupRepository.save(adGroupData);

      await KeywordRepository.save({
        adGroupId: adGroupIdFromDB,
        broad: JSON.stringify(item.keywords.broad),
        phrase: JSON.stringify(item.keywords.phrase),
        exact: JSON.stringify(item.keywords.exact),
      });
    }
  
    return result;
  }
}
