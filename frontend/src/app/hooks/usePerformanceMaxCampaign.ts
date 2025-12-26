import { useState } from "react";
import { api } from "../../services/api";

type CreationStatus = {
  type: "success" | "error";
  message: string;
};

export function usePerformanceMaxCampaign() {
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] =
    useState<CreationStatus | null>(null);

  // Wizard step
  const [step, setStep] = useState(0);

  // Form data (same pattern as useCampaigns)
  const [formData, setFormData] = useState({
    campaignName: "",
    dailyBudget: "",
    targetLocation: "all",
    finalUrl: "",
    headlines: ["", "", ""],
    descriptions: ["", ""],
    images: {
      square: null as File | null,
      landscape: null as File | null,
      logo: null as File | null,
    },
  });

  /* ---------------------------------
   * Navigation
   * --------------------------------- */
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  /* ---------------------------------
   * Input handlers (consistent style)
   * --------------------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: "headlines" | "descriptions",
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleImageChange = (key: "square" | "landscape" | "logo", file: File) => {
    setFormData((prev) => ({
      ...prev,
      images: { ...prev.images, [key]: file },
    }));
  };

  /* ---------------------------------
   * Create Performance Max Campaign
   * --------------------------------- */
  const createCampaign = async () => {
    if (!formData.campaignName || !formData.dailyBudget || !formData.finalUrl) {
      setCreationStatus({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsCreating(true);
    setCreationStatus(null);

    try {
      const data = new FormData();

      data.append("name", formData.campaignName);
      data.append("budget", formData.dailyBudget);
      data.append("location", formData.targetLocation);
      data.append("finalUrl", formData.finalUrl);
      data.append(
        "headlines",
        JSON.stringify(formData.headlines.filter(Boolean))
      );
      data.append(
        "descriptions",
        JSON.stringify(formData.descriptions.filter(Boolean))
      );

      Object.entries(formData.images).forEach(([key, file]) => {
        if (file) data.append(key, file);
      });

      await api.createPerformanceMaxCampaign(data);

      setCreationStatus({
        type: "success",
        message: "Performance Max campaign created successfully!",
      });
    } catch (error: any) {
      setCreationStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Failed to create Performance Max campaign",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    // wizard
    step,
    nextStep,
    prevStep,
  
    // form
    formData,
    setFormData,
    handleInputChange,
    handleArrayChange,
    handleImageChange,
  
    // submit
    isCreating,
    creationStatus,
    createCampaign,
  };  
}
