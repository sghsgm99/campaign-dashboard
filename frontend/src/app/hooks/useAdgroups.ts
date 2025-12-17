import { useEffect, useState } from "react";
import { api } from "../../services/api";

type CreationStatus = {
  type: "success" | "error";
  message: string;
};

export function useAdgroups() {
  const [adgroups, setAdgroups] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus | null>(null);

  const loadAdgroups = async () => {
    try {
      const data = await api.getAdgroups();
      setAdgroups(data);
    } catch (err) {
      console.error("Failed to load adgroups:", err);
    }
  };

  useEffect(() => {
    loadAdgroups();
  }, []);

  const loadAdGroupsByCampaign = async (campaignId: string) => {
    try {
      return await api.getAdGroupsByCampaign(campaignId);
    } catch {
      return [];
    }
  };

  const createAdgroups = async (payload: any[]) => {
    setIsCreating(true);
    setCreationStatus(null);

    try {
      await api.createAdgroup({ adGroups: payload });
      setCreationStatus({
        type: "success",
        message: "Ad groups created successfully!",
      });
      await loadAdgroups();
    } catch (error: any) {
      setCreationStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Failed to create ad groups",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    adgroups,
    isCreating,
    creationStatus,

    loadAdgroups,
    loadAdGroupsByCampaign,
    createAdgroups,
  };
}
