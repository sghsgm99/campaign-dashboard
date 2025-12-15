import { RowDataPacket } from "mysql2";

export interface Ad extends RowDataPacket {
  id: number;
  adGroupId: number;
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  googleAdId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdDB {
  adGroupId: number;
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  status: Ad["status"];
  googleAdId?: number | null;
}

export interface CreateAdDTO {
  adGroupId: number;
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  status: Ad["status"];
}

export interface CreateAdRequest {
  ads: CreateAdDTO[];
}