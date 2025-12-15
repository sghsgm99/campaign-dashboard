import { db } from "../../config/database";
import { AdGroup, CreateAdGroupDB } from "./adgroup.types";
import { ResultSetHeader } from "mysql2";

export class AdGroupRepository {
  static async findAll(): Promise<AdGroup[]> {
    const [rows] = await db.query<AdGroup[]>(`
      SELECT
        id,
        name
        created_at AS createdAt
      FROM adgroups
      ORDER BY created_at DESC
    `);

    return rows;
  }

  static async save(data: CreateAdGroupDB) {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO adgroups (campaign_id, name, cpc_bid)
      VALUES (?, ?, ?)
      `,
      [data.campaignId, data.name, data.cpcBid]
    );

    return result.insertId;
  }
}
