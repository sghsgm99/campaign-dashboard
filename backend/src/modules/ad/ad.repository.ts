import { db } from "../../config/database";
import { Ad, CreateAdDB } from "./ad.types";
import { ResultSetHeader } from "mysql2";

export class AdRepository {
  static async getAll(): Promise<Ad[]> {
    const [rows] = await db.query<Ad[]>(`
      SELECT
        a.id,
        c.name as campaignName,
        ag.name as adgroupName,
        a.status,
        a.headlines,
        a.descriptions,
        a.final_url as finalUrl,
        a.created_at AS createdAt
      FROM ads a
      INNER JOIN adgroups ag
        ON a.adgroup_id = ag.id
      INNER JOIN campaigns c
        ON c.id = ag.campaign_id
      ORDER BY a.created_at DESC
    `);

    return rows.map(ad => ({
      ...ad,
      headlines: JSON.parse(ad.headlines as unknown as string),
      descriptions: JSON.parse(ad.descriptions as unknown as string),
    }));
  }

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
