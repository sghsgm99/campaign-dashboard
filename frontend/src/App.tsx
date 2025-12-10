import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Plus } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import CampaignsTab from './components/CampaignsTab';
import CreateCampaignTab from './components/CreateCampaignTab';
import CreateAdgroupTab from './components/CreateAdgroupTab';

type CreationStatus = {
  type: 'success' | 'error';
  message: string;
};

const GoogleAdsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'create_campaign' | 'create_adgroup'>('create_campaign');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [formData, setFormData] = useState({
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
    biddingStrategy: 'MAXIMIZE_CLICKS',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<CreationStatus | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          formData.adHeadline3,
        ].filter(Boolean),
        descriptions: [
          formData.adDescription1,
          formData.adDescription2,
        ].filter(Boolean),
        finalUrl: formData.finalUrl,
        biddingStrategy: formData.biddingStrategy,
      };

      await api.createCampaign(payload);
      setCreationStatus({ type: 'success', message: 'Campaign created successfully!' });

      await loadCampaigns();

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
        biddingStrategy: 'MAXIMIZE_CLICKS',
      });

      setTimeout(() => {
        setActiveTab('campaigns');
        setCreationStatus(null);
      }, 1500);
    } catch (error: any) {
      console.error('API Error:', error);
      setCreationStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to create_campaign',
      });
    }

    setIsCreating(false);
  };

  const handleCreateAdgroup = async (adGroupsPayload: any[]) => {
    setIsCreating(true);
    setCreationStatus(null);
  
    try {
      await api.createAdgroup({ adGroups: adGroupsPayload });
  
      setCreationStatus({ type: "success", message: "Ad groups created successfully!" });
  
      await loadCampaigns();
  
      setTimeout(() => {
        setActiveTab("campaigns");
        setCreationStatus(null);
      }, 1500);
    } catch (error: any) {
      console.error("API Error:", error);
      setCreationStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to create ad groups",
      });
    }
  
    setIsCreating(false);
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Google Ads Manager</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage your advertising campaigns</p>
          </div>
          <button
            onClick={() => setActiveTab('create_campaign')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Create Campaign
          </button>
        </div>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab campaigns={campaigns} />}
        {activeTab === 'campaigns' && <CampaignsTab campaigns={campaigns} />}
        {activeTab === 'create_campaign' && (
          <CreateCampaignTab
            formData={formData}
            creationStatus={creationStatus}
            isCreating={isCreating}
            handleInputChange={handleInputChange}
            handleCreateCampaign={handleCreateCampaign}
          />
        )}
        {activeTab === 'create_adgroup' && (
          <CreateAdgroupTab
            creationStatus={creationStatus}
            isCreating={isCreating}
            handleCreateAdgroup={handleCreateAdgroup}
          />
        )}
      </div>
    </div>
  );
};

export default GoogleAdsDashboard;
