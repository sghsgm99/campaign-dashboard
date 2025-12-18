import { db } from "../../config/database";
import { Campaign, CreateCampaignDB } from "./campaign.types";
import { ResultSetHeader } from "mysql2";

export class CampaignRepository {
  static async findAll(): Promise<Campaign[]> {
    const [rows] = await db.query<Campaign[]>(`
      SELECT
        id,
        name,
        status,
        budget,
        google_campaign_id,
        channel_type AS channelType,
        created_at AS createdAt
      FROM campaigns
      ORDER BY created_at DESC
    `);

    return rows;
  }

  static async save(data: CreateCampaignDB) {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO campaigns (name, status, channel_type, budget, location, google_campaign_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [data.name, data.status, data.channelType, data.budget, data.location, data.googleCampaignId]
    );

    return result.insertId;
  }
}
