import { db } from "../../config/database";
import { CreateNegativeKeywordDB } from "./negativekeyword.types";
import { ResultSetHeader } from "mysql2";

export class NegativeKeywordRepository {
  static async save(data: CreateNegativeKeywordDB) {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO negative_keywords (level, campaign_id, adgroup_id, broad, phrase, exact)
      VALUES (
        ?,
        (SELECT id FROM campaigns WHERE google_campaign_id = ?),
        (SELECT id FROM adgroups WHERE google_adgroup_id = ?),
        ?, 
        ?,
        ?
      )
      `,
      [data.level, data.campaignId, data.adGroupId, data.broad, data.phrase, data.exact]
    );

    return result.insertId;
  }
}
