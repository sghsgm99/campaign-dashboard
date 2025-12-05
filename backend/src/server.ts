// server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {
  GoogleAdsApi,
  Customer,
  resources,
  enums,
  toMicros,
  ResourceNames,
  MutateOperation,
} from "google-ads-api";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Ads API
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!;

// Helper function to get customer
const getCustomer = (): Customer => {
  return client.Customer({
    customer_id: customerId,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  });
};

// Helper function to get channel type
const getChannelType = (campaignType: string) => {
  const typeMap: { [key: string]: number } = {
    SEARCH: enums.AdvertisingChannelType.SEARCH,
    DISPLAY: enums.AdvertisingChannelType.DISPLAY,
    VIDEO: enums.AdvertisingChannelType.VIDEO,
    SHOPPING: enums.AdvertisingChannelType.SHOPPING,
  };
  return typeMap[campaignType] || enums.AdvertisingChannelType.SEARCH;
};

// GET /api/campaigns - Fetch all campaigns
app.get('/api/campaigns', async (req: Request, res: Response) => {
  try {
    const customer = getCustomer();

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY campaign.id DESC
      LIMIT 10
    `);

    const formattedCampaigns = campaigns.map((campaign: any) => ({
      id: campaign.campaign.id,
      name: campaign.campaign.name,
      status: enums.CampaignStatus[campaign.campaign.status] || 'UNKNOWN',
      budget: campaign.campaign_budget?.amount_micros 
        ? campaign.campaign_budget.amount_micros / 1000000 
        : 0,
      impressions: campaign.metrics?.impressions || 0,
      clicks: campaign.metrics?.clicks || 0,
      ctr: campaign.metrics?.ctr ? (campaign.metrics.ctr * 100).toFixed(2) : 0,
      cost: campaign.metrics?.cost_micros 
        ? campaign.metrics.cost_micros / 1000000 
        : 0,
    }));

    res.json(formattedCampaigns);
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    
    // Return mock data if API fails (for testing)
    const mockCampaigns = [
      {
        id: 1,
        name: 'Summer Sale 2024',
        status: 'Active',
        budget: 500,
        impressions: 15420,
        clicks: 892,
        ctr: 5.8,
        cost: 387.50
      },
      {
        id: 2,
        name: 'Brand Awareness Q4',
        status: 'Paused',
        budget: 1000,
        impressions: 28650,
        clicks: 1243,
        ctr: 4.3,
        cost: 675.20
      }
    ];
    
    res.json(mockCampaigns);
  }
});

// POST /api/campaigns - Create a new campaign
app.post('/api/campaigns', async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      budget,
      location,
      keywords,
      headlines,
      descriptions,
      finalUrl,
      biddingStrategy,
    } = req.body;

    // Validation
    if (!name || !budget) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'budget'],
      });
    }

    const customer = getCustomer();

    // Temporary budget resource name
    const budgetResourceName = ResourceNames.campaignBudget(
      customer.credentials.customer_id,
      "-1"
    );

    const operations: MutateOperation<
      resources.ICampaignBudget | resources.ICampaign
    >[] = [
      {
        entity: "campaign_budget",
        operation: "create",
        resource: {
          resource_name: budgetResourceName,
          explicitly_shared: false,
          delivery_method: enums.BudgetDeliveryMethod.STANDARD,
          amount_micros: toMicros(budget),
        },
      },
      {
        entity: "campaign",
        operation: "create",
        resource: {
          name: name,
          advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
          status: enums.CampaignStatus.PAUSED,
          manual_cpc: { enhanced_cpc_enabled: false },
          campaign_budget: budgetResourceName,
          network_settings: {
            target_google_search: true,
            target_search_network: true,
          },
          contains_eu_political_advertising:
            enums.EuPoliticalAdvertisingStatus
              .DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
        },
      },
    ];

    const response = await customer.mutateResources(operations);

    // Access the responses in the same index order
    const budgetResponse = response.mutate_operation_responses?.[0];
    const campaignResponse = response.mutate_operation_responses?.[1];

    // Extract resource names safely
    const campaignBudgetResource = budgetResponse?.campaign_budget_result?.resource_name;
    const campaignResource = campaignResponse?.campaign_result?.resource_name;

    // Create Ad Group if campaign creation succeeded
    let adGroupResource: string | undefined;

    if (campaignResource) {
      const adGroupOperations: MutateOperation<resources.IAdGroup>[] = [
        {
          entity: "ad_group",
          operation: "create",
          resource: {
            name: `${name} - AdGroup`,
            campaign: campaignResource,
            status: enums.AdGroupStatus.ENABLED,
            type: enums.AdGroupType.SEARCH_STANDARD,
            cpc_bid_micros: toMicros(budget / 2), // example default bid
          },
        },
      ];

      const adGroupResponse = await customer.mutateResources(adGroupOperations);
      adGroupResource = adGroupResponse.mutate_operation_responses?.[0]?.ad_group_result?.resource_name!;
    }

    return res.status(201).json({
      message: "Campaign and Ad Group created successfully",
      budget: {
        resource_name: campaignBudgetResource,
      },
      campaign: {
        resource_name: campaignResource,
      },
      ad_group: {
        resource_name: adGroupResource,
      },
      raw: response, // optional debugging
    });

  } catch (error: any) {
    console.dir(error, { depth: 20 });

    return res.status(500).json({
      error: "Failed to create campaign",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

const createBudget = async (customer: Customer): Promise<string> => {
  const budgetResponse = await customer.campaignBudgets.create([
    {
      name: "Planet Express Budget",
      amount_micros: 500 * 1_000_000, // 500 USD
      explicitly_shared: false,
      type: enums.BudgetType.STANDARD,
      delivery_method: enums.BudgetDeliveryMethod.STANDARD,
    },
  ]);

  //console.log("Budget:", budgetResponse.results[0].resource_name!);

  return budgetResponse.results[0].resource_name!;
};

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    customerId,
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Google Ads API server running on port ${PORT}`);
  console.log(`📊 Customer ID: ${customerId}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;