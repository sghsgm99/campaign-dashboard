import { useState } from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { AdGroup } from "../types/adgroup";

interface CreateNegativeKeywordTabProps {
  creationStatus: { type: "success" | "error"; message: string } | null;
  isCreating: boolean;
  handleCreateNegativeKeyword: (payload: any[]) => void;
  campaignList: any[];
  loadAdGroups: (campaignId: string) => Promise<AdGroup[]>;
}

type LevelType = 1 | 2; // 1=Campaign, 2=AdGroup

const EMPTY_ITEM = {
  level: 1 as LevelType,
  campaignId: "",
  adGroupId: "",
  adGroups: [] as AdGroup[],
  negativeKeywords: {
    broad: "",
    phrase: "",
    exact: "",
  },
};

const CreateNegativeKeywordTab = ({
  creationStatus,
  isCreating,
  handleCreateNegativeKeyword,
  campaignList,
  loadAdGroups,
}: CreateNegativeKeywordTabProps) => {
  const [items, setItems] = useState([ { ...EMPTY_ITEM } ]);

  const updateItem = (index: number, field: string, value: any) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleCampaignChange = async (index: number, campaignId: string) => {
    const adGroups = await loadAdGroups(campaignId);

    setItems(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        campaignId,
        adGroupId: "",
        adGroups,
      };
      return next;
    });
  };

  const updateNegativeKeyword = (
    index: number,
    type: "broad" | "phrase" | "exact",
    value: string
  ) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        negativeKeywords: {
          ...next[index].negativeKeywords,
          [type]: value,
        },
      };
      return next;
    });
  };

  const addItem = () => {
    setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  };

  const submitNegativeKeywords = () => {
    const payload = items.map(i => ({
      level: i.level, // 1 or 2 (matches DB exactly)
      campaignId: i.campaignId,
      adGroupId: i.level === 2 ? i.adGroupId : null,
      negativeKeywords: {
        broad: i.negativeKeywords.broad.split("\n").map(k => k.trim()).filter(Boolean),
        phrase: i.negativeKeywords.phrase.split("\n").map(k => k.trim()).filter(Boolean),
        exact: i.negativeKeywords.exact.split("\n").map(k => k.trim()).filter(Boolean),
      },
    }));

    handleCreateNegativeKeyword(payload);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">

        <h2 className="text-2xl font-bold mb-6">
          Create Negative Keywords
        </h2>

        {/* Status */}
        {creationStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              creationStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {creationStatus.type === "success"
              ? <CheckCircle2 size={20} />
              : <AlertCircle size={20} />}
            <span>{creationStatus.message}</span>
          </div>
        )}

        {items.map((g, index) => (
          <div key={index} className="border-b pb-6 mb-8 space-y-5">

            <h3 className="text-lg font-semibold">
              Negative Keyword #{index + 1}
            </h3>

            {/* Selectors */}
            <div className="grid grid-cols-3 gap-4">

              {/* Level */}
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={g.level}
                onChange={e =>
                  updateItem(index, "level", Number(e.target.value) as LevelType)
                }
              >
                <option value={1}>Campaign Level</option>
                <option value={2}>Ad Group Level</option>
              </select>

              {/* Campaign */}
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={g.campaignId}
                onChange={e =>
                  handleCampaignChange(index, e.target.value)
                }
              >
                <option value="">Select Campaign</option>
                {campaignList.map(c => (
                  <option
                    key={c.google_campaign_id}
                    value={c.google_campaign_id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>

              {/* AdGroup */}
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={g.adGroupId}
                disabled={g.level !== 2 || !g.campaignId}
                onChange={e =>
                  updateItem(index, "adGroupId", e.target.value)
                }
              >
                <option value="">
                  {g.level !== 2
                    ? "Campaign level selected"
                    : g.campaignId
                    ? "Select Ad Group"
                    : "Select campaign first"}
                </option>

                {g.adGroups.map(ag => (
                  <option
                    key={ag.google_adgroup_id}
                    value={ag.google_adgroup_id}
                  >
                    {ag.name}
                  </option>
                ))}
              </select>

            </div>

            {/* Negative Keywords */}
            <div className="grid grid-cols-3 gap-4">

              <textarea
                rows={4}
                className="border rounded-lg px-4 py-2"
                placeholder="Broad Negative Keywords&#10;keyword1&#10;keyword2"
                value={g.negativeKeywords.broad}
                onChange={e =>
                  updateNegativeKeyword(index, "broad", e.target.value)
                }
              />

              <textarea
                rows={4}
                className="border rounded-lg px-4 py-2"
                placeholder="Phrase Negative Keywords&#10;keyword1&#10;keyword2"
                value={g.negativeKeywords.phrase}
                onChange={e =>
                  updateNegativeKeyword(index, "phrase", e.target.value)
                }
              />

              <textarea
                rows={4}
                className="border rounded-lg px-4 py-2"
                placeholder="Exact Negative Keywords&#10;keyword1&#10;keyword2"
                value={g.negativeKeywords.exact}
                onChange={e =>
                  updateNegativeKeyword(index, "exact", e.target.value)
                }
              />

            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={16} /> Add Negative Keyword
        </button>

        <div className="flex gap-4 pt-6">
          <button
            onClick={submitNegativeKeywords}
            disabled={isCreating}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
          >
            {isCreating ? "Creating..." : "Create Negative Keywords"}
          </button>

          <button className="px-6 py-3 border rounded-lg">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateNegativeKeywordTab;
