import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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

const ITEMS_PER_PAGE = 10;

const truncate = (text = '', max = 50) =>
  text.length > max ? text.slice(0, max) + '...' : text;

const AdsTab = ({ ads }: AdsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Filter ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) =>
      ad.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ads, searchQuery]);

  // 🔢 Pagination
  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);

  const paginatedAds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAds, currentPage]);

  // 🔄 Reset page on search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Ads</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search ads..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Ad</th>
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
            {paginatedAds.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 max-w-md">
                  <div className="space-y-1">
                    <div className="text-blue-700 font-medium line-clamp-2">
                      {truncate(ad.headlines?.join(' | ') ?? '', 20)}
                    </div>

                    <div className="text-xs text-green-700 truncate">
                      {ad.finalUrl}
                    </div>

                    <div className="text-sm text-gray-700 line-clamp-2">
                      {ad.descriptions?.join(' . ')}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {ad.campaignName}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {ad.adgroupName}
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
                  {(ad.ctr ?? 0).toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right">
                  ${(ad.cost ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}

            {paginatedAds.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No ads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsTab;
