import CampaignsTab from "../../components/CampaignsTab";
import { useCampaigns } from "../hooks/useCampaigns";

export default function CampaignsPage() {
  const { campaigns } = useCampaigns();

  return <CampaignsTab campaigns={campaigns} />;
}
