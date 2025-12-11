import { useState } from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { CAMPAIGNS } from "../constants/campaigns";

interface CreateAdgroupTabProps {
  creationStatus: { type: "success" | "error"; message: string } | null;
  isCreating: boolean;
  handleCreateAdgroup: (adgroups: any[]) => void;
}

const EMPTY_ADGROUP = {
  campaignId: "",
  adgroupName: "",
  defaultBid: "",
  keywords: {
    broad: "",
    phrase: "",
    exact: "",
  },
};

const CreateAdgroupTab = ({
  creationStatus,
  isCreating,
  handleCreateAdgroup,
}: CreateAdgroupTabProps) => {
  const [adGroups, setAdGroups] = useState([ { ...EMPTY_ADGROUP } ]);

  /** Add new Ad Group block */
  const addAdGroup = () => {
    setAdGroups(prev => [
      ...prev,
      { 
        ...EMPTY_ADGROUP,
        keywords: { broad: "", phrase: "", exact: "" }
      }
    ]);
  };

  /** Update top-level fields */
  const updateAdGroup = (index: number, field: string, value: string) => {
    setAdGroups(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  /** Update keyword groups */
  const updateKeyword = (
    index: number,
    type: "broad" | "phrase" | "exact",
    value: string
  ) => {
    setAdGroups(prev => {
      const updated = [...prev];
      updated[index].keywords[type] = value;
      return updated;
    });
  };

  /** Submit payload */
  const submitAdGroups = () => {
    const payload = adGroups.map(g => ({
      campaignId: g.campaignId,
      name: g.adgroupName,
      defaultBid: parseFloat(g.defaultBid) || 0,
      keywords: {
        broad: g.keywords.broad
          .split("\n")
          .map(k => k.trim())
          .filter(Boolean),

        phrase: g.keywords.phrase
          .split("\n")
          .map(k => k.trim())
          .filter(Boolean),

        exact: g.keywords.exact
          .split("\n")
          .map(k => k.trim())
          .filter(Boolean),
      },
    }));

    handleCreateAdgroup(payload);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Multiple Ad Groups
        </h2>

        {/* Status Message */}
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

        {/* Form blocks */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ad Groups</h3>

          {adGroups.map((g, index) => (
            <div key={index} className="space-y-5 mb-8 border-b pb-6">
              
              {/* Campaign, Name, Bid */}
              <div className="grid grid-cols-3 gap-4">

                {/* Campaign Selector */}
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={g.campaignId}
                  onChange={e => updateAdGroup(index, "campaignId", e.target.value)}
                >
                  <option value="">Select Campaign</option>
                  {CAMPAIGNS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Ad Group Name */}
                <input
                  type="text"
                  placeholder="Ad Group Name"
                  className="px-4 py-2 border rounded-lg"
                  value={g.adgroupName}
                  onChange={e => updateAdGroup(index, "adgroupName", e.target.value)}
                />

                {/* Default Bid */}
                <input
                  type="number"
                  placeholder="Default Bid"
                  className="px-4 py-2 border rounded-lg"
                  value={g.defaultBid}
                  onChange={e => updateAdGroup(index, "defaultBid", e.target.value)}
                />
              </div>

              {/* Keyword Groups Section */}
              <div className="grid grid-cols-3 gap-4">
                
                {/* Broad Match */}
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Broad Match Keywords&#10;keyword1&#10;keyword2"
                  value={g.keywords.broad}
                  onChange={e => updateKeyword(index, "broad", e.target.value)}
                />

                {/* Phrase Match */}
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Phrase Match Keywords&#10;keyword1&#10;keyword2"
                  value={g.keywords.phrase}
                  onChange={e => updateKeyword(index, "phrase", e.target.value)}
                />

                {/* Exact Match */}
                <textarea
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Exact Match Keywords&#10;keyword1&#10;keyword2"
                  value={g.keywords.exact}
                  onChange={e => updateKeyword(index, "exact", e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* Add new ad group */}
          <button
            type="button"
            onClick={addAdGroup}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={16} /> Add Ad Group
          </button>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={submitAdGroups}
              disabled={isCreating}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {isCreating ? "Creating..." : "Create Ad Groups"}
            </button>

            <button className="px-6 py-3 border border-gray-300 rounded-lg">
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateAdgroupTab;
