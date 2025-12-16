import { db } from "../../config/database";
import { AdGroup, CreateAdGroupDB } from "./adgroup.types";
import { ResultSetHeader } from "mysql2";

export class AdGroupRepository {
  static async getAll(): Promise<AdGroup[]> {
    const [rows] = await db.query<AdGroup[]>(`
      SELECT
        ag.id,
        ag.name,
        ag.status,
        ag.cpc_bid as cpcBid,
        ag.created_at AS createdAt,
        c.name as campaignName
      FROM adgroups ag
      INNER JOIN campaigns c
        ON c.id = ag.campaign_id
      ORDER BY ag.created_at DESC
    `);

    return rows;
  }

  static async findAll(googleCampaignId: string): Promise<AdGroup[]> {
    const sql = `
      SELECT
        ag.id,
        ag.name,
        ag.google_adgroup_id,
        ag.created_at AS createdAt
      FROM adgroups ag
      INNER JOIN campaigns c
        ON c.id = ag.campaign_id
      WHERE c.google_campaign_id = ?
      ORDER BY ag.created_at DESC
    `;

    const [rows] = await db.query<AdGroup[]>(sql, [googleCampaignId]);

    return rows;
  }

  static async save(data: CreateAdGroupDB) {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO adgroups (campaign_id, name, cpc_bid, google_adgroup_id)
      VALUES (
        (SELECT id FROM campaigns WHERE google_campaign_id = ?),
        ?, 
        ?, 
        ?
      )
      `,
      [data.googleCampaignId, data.name, data.cpcBid, data.googleAdGroupId]
    );

    return result.insertId;
  }
}
