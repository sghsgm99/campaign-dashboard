import React from 'react';

interface TabNavigationProps {
  activeTab: 'overview' | 'campaigns' | 'create_campaign' | 'create_adgroup';
  setActiveTab: (tab: 'overview' | 'campaigns' | 'create_campaign' | 'create_adgroup') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'campaigns' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('create_campaign')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'create_campaign' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Create Campaign
          </button>
          <button
            onClick={() => setActiveTab('create_adgroup')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'create_adgroup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Create Ad group
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
