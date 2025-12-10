import React, { useState } from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";

interface CreateAdgroupTabProps {
  creationStatus: { type: "success" | "error"; message: string } | null;
  isCreating: boolean;
  handleCreateAdgroup: (adgroups: any[]) => void;
}

const CreateAdgroupTab: React.FC<CreateAdgroupTabProps> = ({
  creationStatus,
  isCreating,
  handleCreateAdgroup,
}) => {
  const [adGroups, setAdGroups] = useState([
    { campaign: "", adgroupName: "", defaultBid: "", keywords: "" },
  ]);

  const addAdGroup = () => {
    setAdGroups((prev) => [
      ...prev,
      { campaign: "", adgroupName: "", defaultBid: "", keywords: "" },
    ]);
  };

  const updateAdGroup = (index: number, field: string, value: string) => {
    setAdGroups((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const submitAdGroups = () => {
    const payload = adGroups.map((g) => ({
      campaignId: g.campaign,
      name: g.adgroupName,
      defaultBid: parseFloat(g.defaultBid),
      keywords: g.keywords
        .split("\n")
        .map((k) => k.trim())
        .filter((k) => k),
    }));

    handleCreateAdgroup(payload);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Ad Groups</h2>

        {creationStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              creationStatus.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {creationStatus.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{creationStatus.message}</span>
          </div>
        )}

        {/* FORM */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ad Groups</h3>

          {adGroups.map((g, index) => (
            <div key={index} className="space-y-4 mb-6 border-b pb-6">
              <div className="grid grid-cols-3 gap-4">
                {/* Campaign Selector */}
                <select
                  className="w-full px-4 py-2 border rounded-lg"
                  value={g.campaign}
                  onChange={(e) => updateAdGroup(index, "campaign", e.target.value)}
                >
                  <option value="">Select Campaign</option>
                  <option value="23336696337">a-cam-1</option>
                  <option value="23331511412">alex-cam</option>
                </select>

                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ad Group Name"
                  value={g.adgroupName}
                  onChange={(e) =>
                    updateAdGroup(index, "adgroupName", e.target.value)
                  }
                />

                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Default Bid"
                  value={g.defaultBid}
                  onChange={(e) =>
                    updateAdGroup(index, "defaultBid", e.target.value)
                  }
                />
              </div>

              {/* Keywords */}
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                placeholder="keyword1\nkeyword2\nkeyword3"
                value={g.keywords}
                onChange={(e) =>
                  updateAdGroup(index, "keywords", e.target.value)
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addAdGroup}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={16} /> Add Ad Group
          </button>

          {/* ACTIONS */}
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
