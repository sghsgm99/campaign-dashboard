import { RowDataPacket } from "mysql2";

export type KeywordInput = {
  adGroupId: number;
  keywords: {
    broad?: string[];
    phrase?: string[];
    exact?: string[];
  };
  googleKeywordResources?: string[];
};

export interface Keyword extends RowDataPacket {
  id: number;
  keyword: string;
  matchType: string;
  campaignName: string;
  adgroupName: string;
  adGroupId: number;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  createdAt: string;
  updatedAt: string;
}