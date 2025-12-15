import { GoogleAdsService } from "../../services/GoogleAdsService";
import { AdRepository } from "./ad.repository";
import { CreateAdDTO } from "./ad.types";

export class AdService {
  private googleAds = new GoogleAdsService();

  async create(payload: CreateAdDTO[]) {
    //const result = await this.googleAds.createAds(payload);

    const result: { adgroupId: number; status: "PAUSED" }[] = [];

    for (const item of payload) {
      if (!item.headlines?.length) {
        throw new Error("At least one headline is required");
      }
      
      const adData = {
        adGroupId: item.adGroupId,
        headlines: item.headlines, 
        descriptions: item.descriptions ?? [],  
        finalUrl: item.finalUrl,
        status: "PAUSED" as "PAUSED",
      };
  
      await AdRepository.save(adData);
  
      result.push({ adgroupId: item.adGroupId, status: "PAUSED" });
    }

    return result;
  }
}
