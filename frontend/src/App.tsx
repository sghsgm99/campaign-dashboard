import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Plus } from 'lucide-react';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import CampaignsTab from './components/CampaignsTab';
import CreateCampaignTab from './components/CreateCampaignTab';
import CreateAdgroupTab from './components/CreateAdgroupTab';
import CreateAdTab from './components/CreateAdTab';
import CreateNegativeKeywordTab from './components/CreateNegativeKeywordTab';
import { Tabs, type TabType } from "./constants/tabs";
import AdgroupsTab from './components/AdgroupsTab';

type CreationStatus = {
  type: 'success' | 'error';
  message: string;
};

const GoogleAdsDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>(Tabs.CREATE_CAMPAIGN);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [adgroups, setAdgroups] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: 'SEARCH',
    dailyBudget: '',
    targetLocation: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<CreationStatus | null>(null);

  useEffect(() => {
    loadCampaigns();
    loadAdgroups();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Error loading campaigns:', err);
    }
  };

  const loadAdgroups = async () => {
    try {
      const data = await api.getAdgroups();
      setAdgroups(data);
    } catch (err) {
      console.error('Error loading adgroups:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCampaign = async () => {
    if (!formData.campaignName || !formData.dailyBudget) {
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
      };

      await api.createCampaign(payload);
      setCreationStatus({ type: 'success', message: 'Campaign created successfully!' });

      await loadCampaigns();

      setFormData({
        campaignName: '',
        campaignType: 'SEARCH',
        dailyBudget: '',
        targetLocation: '',
      });

      setTimeout(() => {
        setActiveTab(Tabs.CREATE_CAMPAIGN);
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
        setActiveTab(Tabs.CAMPAIGNS);
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
  
  const handleCreateAd = async (adsPayload: any[]) => {
    setIsCreating(true);
    setCreationStatus(null);
  
    try {
      await api.createAd({ ads: adsPayload });
  
      setCreationStatus({ type: "success", message: "Ads created successfully!" });
  
      await loadCampaigns();
  
      setTimeout(() => {
        setActiveTab(Tabs.CAMPAIGNS);
        setCreationStatus(null);
      }, 1500);
    } catch (error: any) {
      console.error("API Error:", error);
      setCreationStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to create ads",
      });
    }
  
    setIsCreating(false);
  };

  const handleCreateNegativeKeyword = async (negativeKeywordsPayload: any[]) => {
    setIsCreating(true);
    setCreationStatus(null);
  
    try {
      await api.createNegativeKeyword({ negativeKeywords: negativeKeywordsPayload });
  
      setCreationStatus({ type: "success", message: "Negative Kewyords created successfully!" });
  
      await loadCampaigns();
  
      setTimeout(() => {
        setActiveTab(Tabs.CAMPAIGNS);
        setCreationStatus(null);
      }, 1500);
    } catch (error: any) {
      console.error("API Error:", error);
      setCreationStatus({
        type: "error",
        message: error?.response?.data?.message || "Failed to create Negative Kewyords",
      });
    }
  
    setIsCreating(false);
  };

  const loadAdGroups = async (campaignId: string) => {
    try {
      const data = await api.getAdGroupsByCampaign(campaignId);
      return data;
    } catch (err) {
      console.error("Failed to load ad groups:", err);
      return [];
    }
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
            onClick={() => setActiveTab(Tabs.CREATE_CAMPAIGN)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Create Campaign
          </button>
        </div>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === Tabs.OVERVIEW && <OverviewTab campaigns={campaigns} />}
        {activeTab === Tabs.CAMPAIGNS && <CampaignsTab campaigns={campaigns} />}
        {activeTab === Tabs.ADGROUPS && <AdgroupsTab adgroups={adgroups} />}
        {activeTab === Tabs.CREATE_CAMPAIGN && (
          <CreateCampaignTab
            formData={formData}
            creationStatus={creationStatus}
            isCreating={isCreating}
            handleInputChange={handleInputChange}
            handleCreateCampaign={handleCreateCampaign}
          />
        )}
        {activeTab === Tabs.CREATE_ADGROUP && (
          <CreateAdgroupTab
            creationStatus={creationStatus}
            isCreating={isCreating}
            handleCreateAdgroup={handleCreateAdgroup}
            campaignList={campaigns}
          />
        )}
        {activeTab === Tabs.CREATE_AD && (
          <CreateAdTab
            creationStatus={creationStatus}
            isCreating={isCreating}
            handleCreateAd={handleCreateAd}
            campaignList={campaigns}
            loadAdGroups={loadAdGroups}
          />
        )}
        {activeTab === Tabs.CREATE_NEGATIVE_KEYWORD && (
          <CreateNegativeKeywordTab
            creationStatus={creationStatus}
            isCreating={isCreating}
            handleCreateNegativeKeyword={handleCreateNegativeKeyword}
            campaignList={campaigns}
            loadAdGroups={loadAdGroups}
          />
        )}
      </div>
    </div>
  );
};

export default GoogleAdsDashboard;
