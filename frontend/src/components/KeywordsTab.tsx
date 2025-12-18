import { useState } from 'react';
import { Search } from 'lucide-react';

interface Keyword {
  id: string;
  keyword: string;
  matchType: string;
  campaignName: string;
  adgroupName: string;
  status: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cost?: number;
}

interface KeywordsTabProps {
  keywords: Keyword[];
}

const KeywordsTab = ({ keywords }: KeywordsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKeywords = keywords.filter((kw) =>
    kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Keywords</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Keywords..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Keyword</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Match type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Ad group</th>              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">Impressions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">Clicks</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">CTR</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">Cost</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredKeywords.map((kw) => (
              <tr key={kw.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{kw.keyword}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{kw.matchType}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{kw.campaignName}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{kw.adgroupName}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      kw.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {kw.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {(kw.impressions ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {(kw.clicks ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {((kw.ctr ?? 0) || 0).toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right">${(kw.cost ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordsTab;
