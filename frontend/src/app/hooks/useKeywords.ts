import { useEffect, useState } from "react";
import { api } from "../../services/api";

export function useKeywords() {
  const [keywords, setKeywords] = useState<any[]>([]);
  
  const loadKeywords = async () => {
    try {
      const data = await api.getKeywords();
      setKeywords(data);
    } catch (err) {
      console.error("Failed to load keywords:", err);
    }
  };

  useEffect(() => {
    loadKeywords();
  }, []);
  
  return {
    keywords,
  
    loadKeywords,
  };
}
