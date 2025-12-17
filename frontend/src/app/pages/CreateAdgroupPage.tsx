import CreateAdgroupTab from "../../components/CreateAdgroupTab";
import { useCampaigns } from "../hooks/useCampaigns";
import { useAdgroups } from "../hooks/useAdgroups";

export default function CreateAdgroupPage() {
  const { campaigns } = useCampaigns();
  const { isCreating, creationStatus, createAdgroups } = useAdgroups();

  return (
    <CreateAdgroupTab
      campaignList={campaigns}
      isCreating={isCreating}
      creationStatus={creationStatus}
      handleCreateAdgroup={createAdgroups}
    />
  );
}
