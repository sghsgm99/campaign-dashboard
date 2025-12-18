import { db } from "../../config/database";
import { ResultSetHeader } from "mysql2";
import { KeywordInput } from "./keyword.types";

export class KeywordRepository {
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
