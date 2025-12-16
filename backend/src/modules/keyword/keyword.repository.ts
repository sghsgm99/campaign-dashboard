import { db } from "../../config/database";
import { ResultSetHeader } from "mysql2";

export class KeywordRepository {
  static async save(data: { adGroupId: number; broad: string; phrase: string; exact: string }) {
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO keywords (adgroup_id, broad, phrase, exact)
      VALUES (?, ?, ?, ?)
      `,
      [data.adGroupId, data.broad, data.phrase, data.exact]
    );
  
    return result.insertId;
  }  
}
