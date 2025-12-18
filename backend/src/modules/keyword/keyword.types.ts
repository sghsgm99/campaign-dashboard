export type KeywordInput = {
  adGroupId: number;
  keywords: {
    broad?: string[];
    phrase?: string[];
    exact?: string[];
  };
  googleKeywordResources?: string[];
};
