import AdsTab from "../../components/AdsTab";
import { useAds } from "../hooks/useAds";

export default function AdsPage() {
  const { ads } = useAds();

  return <AdsTab ads={ads} />;
}
