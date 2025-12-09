import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cost: number;
}

interface CampaignsTabProps {
  campaigns: Campaign[];
}

const CampaignsTab: React.FC<CampaignsTabProps> = ({ campaigns }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter campaigns based on the search query
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Campaigns</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Budget</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Impressions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Clicks</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">CTR</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Cost</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{campaign.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">${campaign.budget}</td>
                <td className="px-6 py-4 text-right">{campaign.impressions.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{campaign.clicks.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">{campaign.ctr}%</td>
                <td className="px-6 py-4 text-right">${campaign.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsTab;
