import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateCampaignTabProps {
  formData: {
    campaignName: string;
    campaignType: string;
    dailyBudget: string;
    targetLocation: string;
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
                disabled
              >
                <option value="SEARCH">Search</option>
                <option value="DISPLAY">
                  Display
                </option>
                <option value="VIDEO">
                  Video
                </option>
              </select>

              <div className="relative w-full">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  name="dailyBudget"
                  value={formData.dailyBudget}
                  onChange={handleInputChange}
                  placeholder="Daily Budget"
                  className="w-full pl-8 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <select
              name="targetLocation"
              value={formData.targetLocation}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="all">All countries and territories</option>
              <option value="us_ca">United States and Canada</option>
              <option value="us">United States</option>
            </select>
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
