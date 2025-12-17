import { useEffect, useState } from "react";
import { api } from "../../services/api";

type CreationStatus = {
  type: "success" | "error";
  message: string;
};

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus | null>(null);

  const [formData, setFormData] = useState({
    campaignName: "",
    campaignType: "SEARCH",
    dailyBudget: "",
    targetLocation: "",
  });

  const loadCampaigns = async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createCampaign = async () => {
    if (!formData.campaignName || !formData.dailyBudget) {
      setCreationStatus({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsCreating(true);
    setCreationStatus(null);

    try {
      await api.createCampaign({
        name: formData.campaignName,
        type: formData.campaignType,
        budget: Number(formData.dailyBudget),
        location: formData.targetLocation,
      });

      setCreationStatus({
        type: "success",
        message: "Campaign created successfully!",
      });

      await loadCampaigns();
    } catch (error: any) {
      setCreationStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Failed to create campaign",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    campaigns,
    formData,
    isCreating,
    creationStatus,

    loadCampaigns,
    handleInputChange,
    createCampaign,
  };
}
