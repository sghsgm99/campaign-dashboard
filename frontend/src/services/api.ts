import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  getCampaigns: async () => {
    const response = await axios.get(`${API_BASE_URL}/campaigns`);
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
};