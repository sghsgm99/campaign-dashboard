import { GoogleAdsService } from "../../services/GoogleAdsService";
import { KeywordRepository } from "./keyword.repository";

export class KeywordService {
  async getAll() {
    return KeywordRepository.getAll();
  }
}
