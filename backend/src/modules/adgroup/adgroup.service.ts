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

    let keywordResourceIndex = 0;

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

      // ✅ count how many keywords THIS ad group has
      const keywordCount =
        (item.keywords.broad?.length || 0) +
        (item.keywords.phrase?.length || 0) +
        (item.keywords.exact?.length || 0);

      // ✅ slice ONLY this ad group's keyword resources
      const keywordResourcesForAdGroup = result.keywords.slice(
        keywordResourceIndex,
        keywordResourceIndex + keywordCount
      );

      // ✅ advance global index
      keywordResourceIndex += keywordCount;

      await KeywordRepository.save({
        adGroupId: adGroupIdFromDB,
        keywords: item.keywords,
        googleKeywordResources: keywordResourcesForAdGroup
      });
    }
  
    return result;
  }
}
