import { RowDataPacket } from "mysql2";

export interface NegativeKeyword extends RowDataPacket {
  id: number;
  campaignId: number;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  type:
    | "SEARCH_STANDARD"
    | "DISPLAY_STANDARD"
    | "SHOPPING_STANDARD"
    | "VIDEO_TRUEVIEW";
  cpcBid: number | null;
  googleNegativeKeywordId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNegativeKeywordDB {
  level: number
  campaignId: number;
  adGroupId: number;
  broad: string;
  phrase: string;
  exact: string;
}

export interface CreateNegativeKeywordDTO {
  level: number
  campaignId: number;
  adGroupId: number;
  negativeKeywords: {
    broad: string[];
    phrase: string[];
    exact: string[];
  };
}

export interface CreateNegativeKeywordRequest {
  negativeKeywords: CreateNegativeKeywordDTO[];
}