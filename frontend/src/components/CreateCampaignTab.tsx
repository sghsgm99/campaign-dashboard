import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateCampaignTabProps {
  formData: {
    campaignName: string;
    campaignType: string;
    dailyBudget: string;
    targetLocation: string;
    broadKeywords: string;
    phraseKeywords: string;
    exactKeywords: string;
  };
  creationStatus: { type: 'success' | 'error'; message: string } | null;
  isCreating: boolean;
  handleInputChange: (e: any) => void;
  handleCreateCampaign: () => void;
}

const CreateCampaignTab = ({
  formData,
  creationStatus,
  isCreating,
  handleInputChange,
  handleCreateCampaign,
}: CreateCampaignTabProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>

        {/* Status Message */}
        {creationStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              creationStatus.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {creationStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{creationStatus.message}</span>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Campaign Basics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Basics</h3>

            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleInputChange}
              placeholder="Campaign Name"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                name="campaignType"
                value={formData.campaignType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="SEARCH">Search</option>
                <option value="DISPLAY" disabled>
                  Display
                </option>
                <option value="VIDEO" disabled>
                  Video
                </option>
              </select>

              <input
                type="number"
                name="dailyBudget"
                value={formData.dailyBudget}
                onChange={handleInputChange}
                placeholder="Daily Budget"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <input
              type="text"
              name="targetLocation"
              value={formData.targetLocation}
              onChange={handleInputChange}
              placeholder="Target Location"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Negative Keywords */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Negative Keywords</h3>

            <div className="grid grid-cols-3 gap-4">
              <textarea
                name="broadKeywords"
                value={formData.broadKeywords}
                onChange={handleInputChange}
                rows={4}
                placeholder="Broad Match Keywords&#10;keyword1&#10;keyword2"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <textarea
                name="phraseKeywords"
                value={formData.phraseKeywords}
                onChange={handleInputChange}
                rows={4}
                placeholder="Phrase Match Keywords&#10;keyword1&#10;keyword2"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <textarea
                name="exactKeywords"
                value={formData.exactKeywords}
                onChange={handleInputChange}
                rows={4}
                placeholder="Exact Match Keywords&#10;keyword1&#10;keyword2"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleCreateCampaign}
              disabled={isCreating}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              {isCreating ? 'Creating...' : 'Create Campaign'}
            </button>

            <button className="px-6 py-3 border border-gray-300 rounded-lg">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignTab;
