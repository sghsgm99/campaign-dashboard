import React from 'react';
import { Eye, MousePointer, TrendingUp, DollarSign } from 'lucide-react';
import MetricCard from './MetricCard';

interface OverviewTabProps {
  campaigns: any[];
}

const OverviewTab = ({ campaigns }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={Eye} label="Total Impressions" value="44.1K" change={12.5} color="bg-blue-600" />
        <MetricCard icon={MousePointer} label="Total Clicks" value="2,135" change={8.3} color="bg-green-600" />
        <MetricCard icon={TrendingUp} label="Avg. CTR" value="4.8%" change={-2.1} color="bg-purple-600" />
        <MetricCard icon={DollarSign} label="Total Spend" value="$1,063" change={15.7} color="bg-orange-600" />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
        <div className="space-y-4">
          {campaigns.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{c.name}</div>
                <div className="text-sm text-gray-600">{c.status}</div>
              </div>
              <div className="grid grid-cols-4 gap-8 text-right">
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.impressions.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Impressions</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.clicks.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Clicks</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.ctr}%</div>
                  <div className="text-xs text-gray-600">CTR</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">${c.cost.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Spent</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
