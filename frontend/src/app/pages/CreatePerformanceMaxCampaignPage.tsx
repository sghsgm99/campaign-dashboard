import PMaxWizard from "../../components/pmax/PMaxWizard";
import { usePerformanceMaxCampaign } from "../hooks/usePerformanceMaxCampaign";

export default function CreatePerformanceMaxCampaignPage() {
  const pmax = usePerformanceMaxCampaign();

  return <PMaxWizard {...pmax} />;
}
