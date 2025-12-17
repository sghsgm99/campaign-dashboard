import CreateNegativeKeywordTab from "../../components/CreateNegativeKeywordTab";
import { useCampaigns } from "../hooks/useCampaigns";
import { useAdgroups } from "../hooks/useAdgroups";
import { useNegativeKeywords } from "../hooks/useNegativeKeywords";

export default function CreateNegativeKeywordPage() {
  const { campaigns } = useCampaigns();
  const { loadAdGroupsByCampaign } = useAdgroups();
  const {
    isCreating,
    creationStatus,
    createNegativeKeywords,
  } = useNegativeKeywords();

  return (
    <CreateNegativeKeywordTab
      campaignList={campaigns}
      isCreating={isCreating}
      creationStatus={creationStatus}
      handleCreateNegativeKeyword={createNegativeKeywords}
      loadAdGroups={loadAdGroupsByCampaign}
    />
  );
}
