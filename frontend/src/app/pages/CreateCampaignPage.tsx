import CreateCampaignTab from "../../components/CreateCampaignTab";
import { useCampaigns } from "../hooks/useCampaigns";

export default function CreateCampaignPage() {
  const {
    formData,
    isCreating,
    creationStatus,
    handleInputChange,
    createCampaign,
  } = useCampaigns();

  return (
    <CreateCampaignTab
      formData={formData}
      isCreating={isCreating}
      creationStatus={creationStatus}
      handleInputChange={handleInputChange}
      handleCreateCampaign={createCampaign}
    />
  );
}
