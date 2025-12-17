import AdgroupsTab from "../../components/AdgroupsTab";
import { useAdgroups } from "../hooks/useAdgroups";

export default function AdgroupsPage() {
  const { adgroups } = useAdgroups();

  return <AdgroupsTab adgroups={adgroups} />;
}
