import { useState } from "react";
import { api } from "../../services/api";

type CreationStatus = {
  type: "success" | "error";
  message: string;
};

export function useNegativeKeywords() {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus | null>(null);

  const createNegativeKeywords = async (payload: any[]) => {
    setIsCreating(true);
    setCreationStatus(null);

    try {
      await api.createNegativeKeyword({ negativeKeywords: payload });
      setCreationStatus({
        type: "success",
        message: "Negative keywords created successfully!",
      });
    } catch (error: any) {
      setCreationStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to create negative keywords",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    creationStatus,
    createNegativeKeywords,
  };
}
