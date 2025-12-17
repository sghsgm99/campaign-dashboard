import { useState } from "react";
import { api } from "../../services/api";

type CreationStatus = {
  type: "success" | "error";
  message: string;
};

export function useAds() {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus | null>(null);

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
    isCreating,
    creationStatus,
    createAds,
  };
}
