import { useState } from 'react';
import { Search } from 'lucide-react';

interface Adgroup {
  id: string;
  campaignName: string;
  name: string;
  status: string;
  cpcBid: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cost?: number;
}

interface AdgroupsTabProps {
  adgroups: Adgroup[];
}

const AdgroupsTab = ({ adgroups }: AdgroupsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAdgroups = adgroups.filter((adgroup) =>
    adgroup.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Ad groups</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search adgroups..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Ad group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">CPC</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Impressions</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Clicks</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">CTR</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase">Cost</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredAdgroups.map((adgroup) => (
              <tr key={adgroup.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{adgroup.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{adgroup.campaignName}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      adgroup.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {adgroup.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">${adgroup.cpcBid}</td>
                <td className="px-6 py-4 text-right">
                  {(adgroup.impressions ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {(adgroup.clicks ?? 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {((adgroup.ctr ?? 0) || 0).toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right">${(adgroup.cost ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdgroupsTab;
