import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  formData: any;
  creationStatus: any;
  isCreating: boolean;
  handleInputChange: (e: any, index?: number, field?: string) => void;
  handleCreateCampaign: () => void;
}

export default function CreatePerformanceMaxCampaignTab({
  formData,
  creationStatus,
  isCreating,
  handleInputChange,
  handleCreateCampaign,
}: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-2xl font-bold mb-6">
          Create Performance Max Campaign
        </h2>

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
            {creationStatus.message}
          </div>
        )}

        <div className="space-y-6">
          <input
            name="campaignName"
            value={formData.campaignName}
            onChange={handleInputChange}
            placeholder="Campaign Name"
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            name="finalUrl"
            value={formData.finalUrl}
            onChange={handleInputChange}
            placeholder="Final URL"
            className="w-full border rounded-lg px-4 py-2"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="dailyBudget"
              type="number"
              value={formData.dailyBudget}
              onChange={handleInputChange}
              placeholder="Daily Budget"
              className="w-full border rounded-lg px-4 py-2"
            />

            <select
              name="targetLocation"
              value={formData.targetLocation}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="us">United States</option>
              <option value="us_ca">US + Canada</option>
              <option value="all">All Countries</option>
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Headlines</h3>
            {formData.headlines.map((h: string, i: number) => (
              <input
                key={i}
                value={h}
                onChange={(e) => handleInputChange(e, i, "headlines")}
                placeholder={`Headline ${i + 1}`}
                className="w-full border rounded-lg px-4 py-2 mb-2"
              />
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Descriptions</h3>
            {formData.descriptions.map((d: string, i: number) => (
              <input
                key={i}
                value={d}
                onChange={(e) => handleInputChange(e, i, "descriptions")}
                placeholder={`Description ${i + 1}`}
                className="w-full border rounded-lg px-4 py-2 mb-2"
              />
            ))}
          </div>

          <button
            onClick={handleCreateCampaign}
            disabled={isCreating}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isCreating ? "Creating..." : "Create Performance Max Campaign"}
          </button>
        </div>
      </div>
    </div>
  );
}
