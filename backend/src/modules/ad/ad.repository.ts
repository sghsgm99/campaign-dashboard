import { db } from "../../config/database";
import { Ad, CreateAdDB } from "./ad.types";
import { ResultSetHeader } from "mysql2";

export class AdRepository {
  static async save(data: CreateAdDB) {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO ads (adgroup_id, headlines, descriptions, final_url, google_ad_id)
      VALUES (
        (SELECT id FROM adgroups WHERE google_adgroup_id = ?),
        ?, 
        ?, 
        ?,
        ?
      )
      `,
      [data.adGroupId, JSON.stringify(data.headlines), JSON.stringify(data.descriptions), data.finalUrl, data.googleAdId]
    );

    return result.insertId;
  }
}
