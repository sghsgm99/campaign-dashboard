import CreatePerformanceMaxCampaignTab from "../../components/CreatePerformanceMaxCampaignTab";
import { usePerformanceMaxCampaign } from "../hooks/usePerformanceMaxCampaign";

export default function CreatePerformanceMaxCampaignPage() {
  const {
    formData,
    isCreating,
    creationStatus,
    handleInputChange,
    handleCreateCampaign,
  } = usePerformanceMaxCampaign();

  return (
    <CreatePerformanceMaxCampaignTab
      formData={formData}
      isCreating={isCreating}
      creationStatus={creationStatus}
      handleInputChange={handleInputChange}
      handleCreateCampaign={handleCreateCampaign}
    />
  );
}
