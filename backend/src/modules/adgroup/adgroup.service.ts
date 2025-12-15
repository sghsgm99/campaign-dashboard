import { GoogleAdsService } from "../../services/GoogleAdsService";
import { AdGroupRepository } from "./adgroup.repository";
import { CreateAdGroupDTO } from "./adgroup.types";

export class AdGroupService {
  private googleAds = new GoogleAdsService();

  async getAdGroups(campaignId: string) {
    return AdGroupRepository.findAll(campaignId);
  }

  async create(payload: CreateAdGroupDTO[]) {
    //const result = await this.googleAds.createAdGroups(payload);

    const result: { campaignId: number; name: string; status: "PAUSED" }[] = [];

    for (const item of payload) {
      const adGroupData = {
        campaignId: item.campaignId,
        name: item.name,
        status: "PAUSED" as "PAUSED",
        cpcBid: item.cpcBid,
        type: "SEARCH_STANDARD" as "SEARCH_STANDARD",
      };
  
      await AdGroupRepository.save(adGroupData);
  
      result.push({ campaignId: item.campaignId, name: item.name, status: "PAUSED" });
    }

    return result;
  }
}
