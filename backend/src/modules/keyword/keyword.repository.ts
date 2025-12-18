import { db } from "../../config/database";
import { ResultSetHeader } from "mysql2";
import { Keyword, KeywordInput } from "./keyword.types";

export class KeywordRepository {
  static async getAll(): Promise<Keyword[]> {
    const [rows] = await db.query<Keyword[]>(`
      SELECT
        a.id,
        a.keyword,
        a.match_type as matchType,
        c.name as campaignName,
        ag.name as adgroupName,
        a.status,
        a.created_at AS createdAt
      FROM keywords a
      INNER JOIN adgroups ag
        ON a.adgroup_id = ag.id
      INNER JOIN campaigns c
        ON c.id = ag.campaign_id
      ORDER BY a.created_at DESC
    `);

    return rows;
  }

  static async save(data: KeywordInput) {
    const { adGroupId, keywords, googleKeywordResources = [] } = data;

    const rows: any[] = [];
    let resourceIndex = 0;

    const pushKeywords = (list: string[] | undefined, matchType: string) => {
      if (!list) return;

      for (const keyword of list) {
        const resource = googleKeywordResources[resourceIndex];
        const googleKeywordId = resource
          ? resource.split("~").pop()
          : null;

        rows.push([
          adGroupId,
          keyword,
          matchType,
          googleKeywordId,
        ]);

        resourceIndex++;
      }
    };

    pushKeywords(keywords.broad, "BROAD");
    pushKeywords(keywords.phrase, "PHRASE");
    pushKeywords(keywords.exact, "EXACT");

    if (!rows.length) return;

    await db.query<ResultSetHeader>(
      `
      INSERT INTO keywords (adgroup_id, keyword, match_type, google_keyword_id)
      VALUES ?
      `,
      [rows]
    );
  }
}
