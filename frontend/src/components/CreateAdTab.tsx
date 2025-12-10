import { useState } from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { CAMPAIGNS } from "../constants/campaigns";

// Create a fresh empty ad each time (deep clone)
const createEmptyAd = () => ({
  campaignId: "",
  adGroupId: "",
  finalUrl: "",
  headlines: ["", "", ""],
  descriptions: ["", ""],
});

interface CreateAdTabProps {
  creationStatus: { type: "success" | "error"; message: string } | null;
  isCreating: boolean;
  handleCreateAd: (ads: any[]) => void;
}

const CreateAdTab = ({ creationStatus, isCreating, handleCreateAd }: CreateAdTabProps) => {

  const [ads, setAds] = useState([createEmptyAd()]);

  const addNewAd = () => {
    setAds(prev => [...prev, createEmptyAd()]);
  };

  const updateField = (index: number, field: string, value: string) => {
    setAds(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };

      if (field === "campaignId") {
        updated[index].adGroupId = "";
      }
      return updated;
    });
  };

  const updateHeadline = (adIndex: number, hIndex: number, value: string) => {
    setAds(prev => {
      const updated = [...prev];
      const headlines = [...updated[adIndex].headlines]; // clone array
      headlines[hIndex] = value;

      updated[adIndex] = {
        ...updated[adIndex],
        headlines
      };
      return updated;
    });
  };

  const updateDescription = (adIndex: number, dIndex: number, value: string) => {
    setAds(prev => {
      const updated = [...prev];
      const descriptions = [...updated[adIndex].descriptions]; // clone array
      descriptions[dIndex] = value;

      updated[adIndex] = {
        ...updated[adIndex],
        descriptions
      };
      return updated;
    });
  };

  const submitAds = () => {
    const payload = ads.map(ad => ({
      ...ad,
      headlines: ad.headlines.filter(Boolean),
      descriptions: ad.descriptions.filter(Boolean),
    }));

    handleCreateAd(payload);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Multiple RSAs</h2>

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

        {ads.map((ad, index) => {
          const selectedCampaign = CAMPAIGNS.find(c => c.id === ad.campaignId);

          return (
            <div key={index} className="mb-8 pb-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ad #{index + 1}
              </h3>

              {/* Campaign + Ad Group */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                  className="px-4 py-2 border rounded-lg"
                  value={ad.campaignId}
                  onChange={e => updateField(index, "campaignId", e.target.value)}
                >
                  <option value="">Select Campaign</option>
                  {CAMPAIGNS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  className="px-4 py-2 border rounded-lg"
                  value={ad.adGroupId}
                  onChange={e => updateField(index, "adGroupId", e.target.value)}
                  disabled={!selectedCampaign}
                >
                  <option value="">Select Ad Group</option>
                  {selectedCampaign?.adgroups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Final URL */}
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg mb-6"
                placeholder="Final URL"
                value={ad.finalUrl}
                onChange={e => updateField(index, "finalUrl", e.target.value)}
              />

              {/* Headlines */}
              <div className="space-y-3 mb-6">
                <p className="font-semibold text-gray-900">
                  Headlines
                </p>

                {ad.headlines.map((h, hIndex) => {
                  const count = h.length;
                  const isOver = count > 30;
                  return (
                    <div key={hIndex}>
                      <input
                        type="text"
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isOver ? "border-red-500" : ""
                        }`}
                        placeholder={`Headline ${hIndex + 1}`}
                        value={h}
                        onChange={e =>
                          updateHeadline(index, hIndex, e.target.value)
                        }
                      />
                      <p
                        className={`text-sm text-right ${
                          isOver ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {count}/30
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Descriptions */}
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">
                  Descriptions
                </p>

                {ad.descriptions.map((d, dIndex) => {
                  const count = d.length;
                  const isOver = count > 90;
                  return (
                    <div key={dIndex}>
                      <textarea
                        rows={2}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          isOver ? "border-red-500" : ""
                        }`}
                        placeholder={`Description ${dIndex + 1}`}
                        value={d}
                        onChange={e =>
                          updateDescription(index, dIndex, e.target.value)
                        }
                      />
                      <p
                        className={`text-sm text-right ${
                          isOver ? "text-red-600" : "text-gray-500"
                        }`}
                      >
                        {count}/90
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addNewAd}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <Plus size={16} /> Add Another Ad
        </button>

        <div className="flex gap-4">
          <button
            onClick={submitAds}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Ads"}
          </button>

          <button className="px-6 py-3 border border-gray-300 rounded-lg">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateAdTab;
