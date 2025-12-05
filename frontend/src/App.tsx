import React, { useState, useEffect } from 'react';
import {
  Plus, 
  Search,
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { api } from './services/api';

type CreationStatus = {
  type: 'success' | 'error';
  message: string;
};


const GoogleAdsDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [campaigns, setCampaigns] = useState([]);

  const [formData, setFormData] = useState({
    campaignName: 'campaignExam',
    campaignType: 'SEARCH',
    dailyBudget: '2',
    targetLocation: '',
    keywords: '',
    adHeadline1: '',
    adHeadline2: '',
    adHeadline3: '',
    adDescription1: '',
    adDescription2: '',
    finalUrl: 'https://www.test.com',
    biddingStrategy: 'MAXIMIZE_CLICKS'
  });

  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<CreationStatus | null>(null);


  // ---------------------------
  // Fetch campaigns on startup
  // ---------------------------  
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading campaigns:', err);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCampaign = async () => {
    if (!formData.campaignName || !formData.dailyBudget || !formData.finalUrl) {
      setCreationStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setIsCreating(true);
    setCreationStatus(null);

    try {
      const payload = {
        name: formData.campaignName,
        type: formData.campaignType,
        budget: parseFloat(formData.dailyBudget),
        location: formData.targetLocation,
        keywords: formData.keywords.split("\n").map(k => k.trim()).filter(k => k),
        headlines: [
          formData.adHeadline1,
          formData.adHeadline2,
          formData.adHeadline3
        ].filter(Boolean),
        descriptions: [
          formData.adDescription1,
          formData.adDescription2
        ].filter(Boolean),
        finalUrl: formData.finalUrl,
        biddingStrategy: formData.biddingStrategy
      };

      await api.createCampaign(payload);

      setCreationStatus({ type: 'success', message: 'Campaign created successfully!' });

      // Reload campaigns from backend  
      await loadCampaigns();

      // Reset form  
      setFormData({
        campaignName: '',
        campaignType: 'SEARCH',
        dailyBudget: '',
        targetLocation: '',
        keywords: '',
        adHeadline1: '',
        adHeadline2: '',
        adHeadline3: '',
        adDescription1: '',
        adDescription2: '',
        finalUrl: '',
        biddingStrategy: 'MAXIMIZE_CLICKS'
      });

      setTimeout(() => {
        setActiveTab('campaigns');
        setCreationStatus(null);
      }, 1500);

    } catch (error: any) {
      console.error('API Error:', error);
      setCreationStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to create campaign'
      });
    }

    setIsCreating(false);
  };

  const MetricCard = ({ icon: Icon, label, value, change, color }: any) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Google Ads Manager</h1>
              <p className="text-sm text-gray-600 mt-1">Create and manage your advertising campaigns</p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 border-b-2 transition ${
                activeTab === 'campaigns'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 border-b-2 transition ${
                activeTab === 'create'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Campaigns Tab -------------------------------- */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">All Campaigns</h2>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search campaigns..."
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
                  {campaigns.map((c: any) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{c.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          c.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">${c.budget}</td>
                      <td className="px-6 py-4 text-right">{c.impressions ?? 0}</td>
                      <td className="px-6 py-4 text-right">{c.clicks ?? 0}</td>
                      <td className="px-6 py-4 text-right">{c.ctr ?? 0}%</td>
                      <td className="px-6 py-4 text-right">${c.cost ?? 0}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

        {/* CREATE TAB -------------------------------- */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>

              {creationStatus && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                    creationStatus.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {creationStatus.type === 'success'
                    ? <CheckCircle2 size={20} />
                    : <AlertCircle size={20} />}
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
                    >
                      <option value="SEARCH">Search</option>
                      <option value="DISPLAY" disabled>Display</option>
                      <option value="VIDEO" disabled>Video</option>
                    </select>

                    <input
                      type="number"
                      name="dailyBudget"
                      value={formData.dailyBudget}
                      onChange={handleInputChange}
                      placeholder="Daily Budget"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <input
                    type="text"
                    name="targetLocation"
                    value={formData.targetLocation}
                    onChange={handleInputChange}
                    placeholder="Target Location"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                </div>

                {/* Keywords */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Keywords</h3>
                  <textarea
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="keyword1\nkeyword2\nkeyword3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Ad Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ad Content</h3>

                  <input
                    name="adHeadline1"
                    value={formData.adHeadline1}
                    onChange={handleInputChange}
                    placeholder="Headline 1"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    name="adHeadline2"
                    value={formData.adHeadline2}
                    onChange={handleInputChange}
                    placeholder="Headline 2"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    name="adHeadline3"
                    value={formData.adHeadline3}
                    onChange={handleInputChange}
                    placeholder="Headline 3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <textarea
                    name="adDescription1"
                    value={formData.adDescription1}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Description 1"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <textarea
                    name="adDescription2"
                    value={formData.adDescription2}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Description 2"
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <input
                    name="finalUrl"
                    type="url"
                    value={formData.finalUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
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

                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className="px-6 py-3 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GoogleAdsDashboard;
