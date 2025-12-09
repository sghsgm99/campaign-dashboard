import React from 'react';

interface TabNavigationProps {
  activeTab: 'overview' | 'campaigns' | 'create campaign';
  setActiveTab: (tab: 'overview' | 'campaigns' | 'create campaign') => void;
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
            onClick={() => setActiveTab('create campaign')}
            className={`py-4 border-b-2 transition ${
              activeTab === 'create campaign' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
