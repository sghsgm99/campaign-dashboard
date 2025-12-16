import { useState } from "react";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { AdGroup } from "../types/adgroup";

interface CreateAdTabProps {
  creationStatus: { type: "success" | "error"; message: string } | null;
  isCreating: boolean;
  handleCreateAd: (ads: any[]) => void;
  campaignList: any[];
  loadAdGroups: (campaignId: string) => Promise<AdGroup[]>;
}

const createEmptyAd = () => ({
  campaignId: "",
  adGroupId: "",
  finalUrl: "",
  headlines: ["", "", ""],
  descriptions: ["", ""],
  adGroups: [] as AdGroup[],
});

const CreateAdTab = ({
  creationStatus,
  isCreating,
  handleCreateAd,
  campaignList,
  loadAdGroups
}: CreateAdTabProps) => {

  const [ads, setAds] = useState([createEmptyAd()]);

  const addNewAd = () => {
    setAds(prev => [...prev, createEmptyAd()]);
  };

  const handleCampaignSelect = async (index: number, campaignId: string) => {
    // reset
    setAds(prev => {
      const updated = [...prev];
      updated[index].campaignId = campaignId;
      updated[index].adGroupId = "";
      updated[index].adGroups = [];
      return updated;
    });
  
    if (!campaignId) return;
  
    const adGroups = await loadAdGroups(campaignId);
  
    setAds(prev => {
      const updated = [...prev];
      updated[index].adGroups = adGroups;
      return updated;
    });
  };  

  const updateField = (index: number, field: string, value: string) => {
    setAds(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateHeadline = (adIndex: number, hIndex: number, value: string) => {
    setAds(prev => {
      const updated = [...prev];
      updated[adIndex].headlines[hIndex] = value;
      return [...updated];
    });
  };

  const updateDescription = (adIndex: number, dIndex: number, value: string) => {
    setAds(prev => {
      const updated = [...prev];
      updated[adIndex].descriptions[dIndex] = value;
      return [...updated];
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

  // -----------------------------------
  // UI Rendering
  // -----------------------------------
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        
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

        {ads.map((ad, index) => (
          <div key={index} className="mb-8 pb-6 border-b">
            <h3 className="text-lg font-semibold mb-4">
              Ad #{index + 1}
            </h3>

            {/* Campaign & Ad Group */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              
              {/* Campaign Select */}
              <select
                className="px-4 py-2 border rounded-lg"
                value={ad.campaignId}
                onChange={e => handleCampaignSelect(index, e.target.value)}
              >
                <option value="">Select Campaign</option>
                {campaignList.map(c => (
                  <option key={c.google_campaign_id} value={c.google_campaign_id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Ad Group Select */}
              <select
                className="px-4 py-2 border rounded-lg"
                value={ad.adGroupId}
                onChange={e => updateField(index, "adGroupId", e.target.value)}
                disabled={!ad.campaignId}
              >
                <option value="">
                  {ad.campaignId ? "Select Ad Group" : "Select campaign first"}
                </option>

                {ad.adGroups.map(ag => (
                  <option key={ag.google_adgroup_id} value={ag.google_adgroup_id}>
                    {ag.name}
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
              <p className="font-semibold">Headlines</p>
              {ad.headlines.map((h, hIndex) => {
                const count = h.length;
                return (
                  <div key={hIndex}>
                    <input
                      type="text"
                      className={`w-full px-4 py-2 border rounded-lg ${
                        count > 30 ? "border-red-500" : ""
                      }`}
                      placeholder={`Headline ${hIndex + 1}`}
                      value={h}
                      onChange={e =>
                        updateHeadline(index, hIndex, e.target.value)
                      }
                    />
                    <p className={`text-sm text-right ${count > 30 ? "text-red-600" : "text-gray-500"}`}>
                      {count}/30
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Descriptions */}
            <div className="space-y-3">
              <p className="font-semibold">Descriptions</p>
              {ad.descriptions.map((d, dIndex) => {
                const count = d.length;
                return (
                  <div key={dIndex}>
                    <textarea
                      rows={2}
                      className={`w-full px-4 py-2 border rounded-lg ${
                        count > 90 ? "border-red-500" : ""
                      }`}
                      placeholder={`Description ${dIndex + 1}`}
                      value={d}
                      onChange={e =>
                        updateDescription(index, dIndex, e.target.value)
                      }
                    />
                    <p className={`text-sm text-right ${count > 90 ? "text-red-600" : "text-gray-500"}`}>
                      {count}/90
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addNewAd}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <Plus size={16} /> Add Another Ad
        </button>

        <button
          onClick={submitAds}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Ads"}
        </button>

      </div>
    </div>
  );
};

export default CreateAdTab;
