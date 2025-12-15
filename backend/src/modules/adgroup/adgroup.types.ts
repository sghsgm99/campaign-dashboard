import { RowDataPacket } from "mysql2";

export interface AdGroup extends RowDataPacket {
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
  googleAdgroupId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdGroupDB {
  campaignId: number;
  name: string;
  status: AdGroup["status"];
  type: AdGroup["type"];
  cpcBid?: number | null;
  googleAdgroupId?: string | null;
}

export interface CreateAdGroupDTO {
  campaignId: number;
  name: string;
  cpcBid: number;  
  status: AdGroup["status"];
  type: AdGroup["type"];
  keywords: {
    broad: string[];
    phrase: string[];
    exact: string[];
  };
  negativeKeywords: {
    broad: string[];
    phrase: string[];
    exact: string[];
  };
}

export interface CreateAdGroupRequest {
  adGroups: CreateAdGroupDTO[];
}