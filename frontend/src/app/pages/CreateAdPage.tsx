import CreateAdTab from "../../components/CreateAdTab";
import { useCampaigns } from "../hooks/useCampaigns";
import { useAdgroups } from "../hooks/useAdgroups";
import { useAds } from "../hooks/useAds";

export default function CreateAdPage() {
  const { campaigns } = useCampaigns();
  const { loadAdGroupsByCampaign } = useAdgroups();
  const { isCreating, creationStatus, createAds } = useAds();

  return (
    <CreateAdTab
      campaignList={campaigns}
      isCreating={isCreating}
      creationStatus={creationStatus}
      handleCreateAd={createAds}
      loadAdGroups={loadAdGroupsByCampaign}
    />
  );
}
