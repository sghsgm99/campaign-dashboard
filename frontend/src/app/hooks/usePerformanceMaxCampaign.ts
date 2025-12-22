import { useState } from "react";
import axios from "axios";

export function usePerformanceMaxCampaign() {
  const [formData, setFormData] = useState({
    campaignName: "",
    dailyBudget: "",
    targetLocation: "us",
    finalUrl: "",
    headlines: ["", "", ""],
    descriptions: ["", ""],
  });

  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleInputChange = (e: any, index?: number, field?: string) => {
    if (field && typeof index === "number") {
      const updated = [...(formData as any)[field]];
      updated[index] = e.target.value;

      setFormData({ ...formData, [field]: updated });
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCampaign = async () => {
    setIsCreating(true);
    setCreationStatus(null);

    try {
      await axios.post("/api/googleads/pmax", {
        name: formData.campaignName,
        budget: Number(formData.dailyBudget),
        location: formData.targetLocation,
        finalUrl: formData.finalUrl,
        headlines: formData.headlines.filter(Boolean),
        descriptions: formData.descriptions.filter(Boolean),
      });

      setCreationStatus({
        type: "success",
        message: "Performance Max campaign created successfully",
      });
    } catch (err: any) {
      setCreationStatus({
        type: "error",
        message: err.response?.data?.message || "Creation failed",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    formData,
    isCreating,
    creationStatus,
    handleInputChange,
    handleCreateCampaign,
  };
}
