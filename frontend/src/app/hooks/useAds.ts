import { useEffect, useState } from "react";
import { api } from "../../services/api";

type CreationStatus = {
  type: "success" | "error";
  message: string;
};

export function useAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus | null>(null);

  const loadAds = async () => {
    try {
      const data = await api.getAds();
      setAds(data);
    } catch (err) {
      console.error("Failed to load ads:", err);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);
  
  const createAds = async (payload: any[]) => {
    setIsCreating(true);
    setCreationStatus(null);

    try {
      await api.createAd({ ads: payload });
      setCreationStatus({
        type: "success",
        message: "Ads created successfully!",
      });
    } catch (error: any) {
      setCreationStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to create ads",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    ads,
    isCreating,
    creationStatus,

    loadAds,
    createAds,
  };
}
