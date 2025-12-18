import { GoogleAdsService } from "../../services/GoogleAdsService";
import { AdRepository } from "./ad.repository";
import { CreateAdDTO } from "./ad.types";

export class AdService {
  private googleAds = new GoogleAdsService();

  async getAll() {
    return AdRepository.getAll();
  }

  async create(payload: CreateAdDTO[]) {
    const result = await this.googleAds.createAds(payload);

    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
  
      const adResource = result?.ads[i];
      const adId = adResource ? adResource.split('/').pop() : null;
  
      if (!adId) {
        throw new Error("Failed to extract adId from result.");
      }
  
      const adGroupData = {
        adGroupId: item.adGroupId,
        headlines: item.headlines, 
        descriptions: item.descriptions ?? [],  
        finalUrl: item.finalUrl,
        status: "PAUSED" as "PAUSED",
        googleAdId: adId
      };
  
      await AdRepository.save(adGroupData);
    }

    return result;
  }
}
