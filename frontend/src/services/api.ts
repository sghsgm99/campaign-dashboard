import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const api = {
  getCampaigns: async () => {
    const response = await axios.get(`${API_BASE_URL}/campaigns`);
    return response.data;
  },

  getAdGroupsByCampaign: async (campaignId: string) => {
    const response = await axios.get(`${API_BASE_URL}/adgroups/${campaignId}`);
    return response.data;
  },

  createCampaign: async (campaignData: any) => {
    const response = await axios.post(`${API_BASE_URL}/campaigns`, campaignData);
    return response.data;
  },

  updateCampaign: async (id: string, data: any) => {
    const response = await axios.patch(`${API_BASE_URL}/campaigns/${id}`, data);
    return response.data;
  },

  deleteCampaign: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/campaigns/${id}`);
    return response.data;
  },

  createAdgroup: async (adgroupData: any) => {
    const response = await axios.post(`${API_BASE_URL}/adgroups`, adgroupData);
    return response.data;
  },

  createAd: async (adData: any) => {
    const response = await axios.post(`${API_BASE_URL}/ads`, adData);
    return response.data;
  },

  createNegativeKeyword: async (negativeKeywordData: any) => {
    const response = await axios.post(`${API_BASE_URL}/negativekeywords`, negativeKeywordData);
    return response.data;
  },
};
