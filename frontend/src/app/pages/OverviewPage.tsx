import OverviewTab from "../../components/OverviewTab";
import { useCampaigns } from "../hooks/useCampaigns";

export default function OverviewPage() {
  const { campaigns } = useCampaigns();

  return <OverviewTab campaigns={campaigns} />;
}
