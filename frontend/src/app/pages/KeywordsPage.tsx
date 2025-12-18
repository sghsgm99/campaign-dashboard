import KeywordsTab from "../../components/KeywordsTab";
import { useKeywords } from "../hooks/useKeywords";

export default function KeywordsPage() {
  const { keywords } = useKeywords();

  return <KeywordsTab keywords={keywords} />;
}
