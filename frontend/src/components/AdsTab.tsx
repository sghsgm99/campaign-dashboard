import { useState } from 'react';
import { Search } from 'lucide-react';

interface Ad {
  id: string;
  campaignName: string;
  adgroupName: string;
  status: string;
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cost?: number;
}

interface AdsTabProps {
  ads: Ad[];
}

const truncate = (text = '', max = 50) =>
  text.length > max ? text.slice(0, max) + '...' : text;

const AdsTab = ({ ads }: AdsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAds = ads.filter((ad) =>
    ad.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Ads</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search ads..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Ad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Ad group</th>              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Impressions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Clicks</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">CTR</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Cost</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredAds.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 max-w-md">
                  <div className="space-y-1">
                    {/* Headlines */}
                    <div className="text-blue-700 font-medium line-clamp-2">
                      {truncate(ad.headlines?.join(' | ') ?? '', 20)}
                    </div>

                    {/* Display URL */}
                    <div className="text-xs text-green-700 truncate">
                      {ad.finalUrl}
                    </div>

                    {/* Descriptions */}
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {ad.descriptions?.join(' . ')}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{ad.campaignName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{ad.adgroupName}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      ad.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ad.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {(ad.impressions ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {(ad.clicks ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {((ad.ctr ?? 0) || 0).toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right">${(ad.cost ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdsTab;
