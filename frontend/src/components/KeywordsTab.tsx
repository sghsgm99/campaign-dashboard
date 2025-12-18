import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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

const ITEMS_PER_PAGE = 10;

const KeywordsTab = ({ keywords }: KeywordsTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Filter
  const filteredKeywords = useMemo(() => {
    return keywords.filter((kw) =>
      kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [keywords, searchQuery]);

  // 🔢 Pagination
  const totalPages = Math.ceil(filteredKeywords.length / ITEMS_PER_PAGE);

  const paginatedKeywords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredKeywords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredKeywords, currentPage]);

  // 🔄 Reset page on search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Keywords</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Keywords..."
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
            {paginatedKeywords.map((kw) => (
              <tr key={kw.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{kw.keyword}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{kw.matchType}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{kw.campaignName}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{kw.adgroupName}</td>
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
                  {(kw.ctr ?? 0).toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right">
                  ${(kw.cost ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}

            {paginatedKeywords.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No keywords found
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

export default KeywordsTab;
