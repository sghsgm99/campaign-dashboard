import { GoogleAdsService } from "../../services/GoogleAdsService";
import { NegativeKeywordRepository } from "./negativekeyword.repository";
import { CreateNegativeKeywordDTO } from "./negativekeyword.types";

export class NegativeKeywordService {
  private googleAds = new GoogleAdsService();

  async create(payload: CreateNegativeKeywordDTO[]) {
    const result = await this.googleAds.createNegativeKeywords(payload);

    for (let i = 0; i < payload.length; i++) {
      const item = payload[i];
  
      await NegativeKeywordRepository.save({
        level: item.level,
        campaignId: item.campaignId,
        adGroupId: item.adGroupId,
        broad: JSON.stringify(item.negativeKeywords.broad),
        phrase: JSON.stringify(item.negativeKeywords.phrase),
        exact: JSON.stringify(item.negativeKeywords.exact),
      });
    }
  
    return result;
  }
}
