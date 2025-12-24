import { RowDataPacket } from "mysql2";

export interface Campaign extends RowDataPacket {
  id: number;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  channelType: "SEARCH" | "DISPLAY" | "VIDEO" | "SHOPPING" | "PERFORMANCE_MAX";
  budget: number;
  googleCampaignId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDB {
  name: string;
  status: Campaign["status"];
  channelType: Campaign["channelType"];
  budget: number;
  googleCampaignId?: string | null;
  location: string;
}

export interface CreateCampaignDTO {
  name: string;
  budget: number;
  type: Campaign["channelType"];
  location: string;
}

export interface CreatePMaxCampaignDTO extends CreateCampaignDTO {
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  images?: {
    square?: Buffer | null;
    landscape?: Buffer | null;
    logo?: Buffer | null;
  };
}

export interface CreatePMaxCampaignDB extends CreateCampaignDB {
  finalUrl: string;
  headlines: string;
  descriptions: string;
  images?: {
    square?: string | null;
    landscape?: string | null;
    logo?: string | null;
  };
}