import {
  Customer,
  enums,
  resources,
  toMicros,
  MutateOperation,
  ResourceNames,
} from "google-ads-api";

import { env } from "../config/env";
import { googleAdsClient } from "../config/googleAdsClient";

export class GoogleAdsService {
  private customer: Customer;

  constructor() {
    this.customer = googleAdsClient.Customer({
      customer_id: env.CUSTOMER_ID,
      refresh_token: env.REFRESH_TOKEN,
    });
  }

  // Get all campaigns
  async getCampaigns() {
    try {
      const query = `
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
        LIMIT 20
      `;

      const data = await this.customer.query(query);

      return data.map((item: any) => ({
        id: item.campaign.id,
        name: item.campaign.name,
        status: enums.CampaignStatus[item.campaign.status],
        budget: (item.campaign_budget.amount_micros || 0) / 1_000_000,
        impressions: item.metrics?.impressions || 0,
        clicks: item.metrics?.clicks || 0,
        ctr: item.metrics?.ctr ? (item.metrics.ctr * 100).toFixed(2) : 0,
        cost: (item.metrics.cost_micros || 0) / 1_000_000,
      }));
    } catch (err) {
      console.error("Google API Error:", err);
      throw new Error("Failed to fetch campaigns");
    }
  }

  // Create campaign workflow
  async createCampaign(payload: any) {
    const { name, budget, keywords, headlines, descriptions, finalUrl } =
      payload;

    // Create budget
    const budgetResourceName = ResourceNames.campaignBudget(
      this.customer.credentials.customer_id,
      "-1",
    );

    const operations: MutateOperation<resources.ICampaignBudget | resources.ICampaign>[] = [
      {
        entity: "campaign_budget",
        operation: "create",
        resource: {
          resource_name: budgetResourceName,
          amount_micros: toMicros(budget),
          explicitly_shared: false,
          delivery_method: enums.BudgetDeliveryMethod.STANDARD,
        },
      },
      {
        entity: "campaign",
        operation: "create",
        resource: {
          name,
          advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
          status: enums.CampaignStatus.PAUSED,
          manual_cpc: { enhanced_cpc_enabled: false },
          campaign_budget: budgetResourceName,
          network_settings: {
            target_google_search: true,
            target_search_network: true,
          },
          contains_eu_political_advertising:
            enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
        },
      },
    ];

    const campaignResult = await this.customer.mutateResources(operations);
    const campaignResource =
      campaignResult.mutate_operation_responses?.[1]?.campaign_result
        ?.resource_name;

    if (!campaignResource) {
      throw new Error("Failed to create campaign.");
    }

    // Create ad group
    const adGroupOperations: MutateOperation<resources.IAdGroup>[] = [
      {
        entity: "ad_group",
        operation: "create",
        resource: {
          name: `${name} - AdGroup`,
          campaign: campaignResource,
          status: enums.AdGroupStatus.ENABLED,
          type: enums.AdGroupType.SEARCH_STANDARD,
          cpc_bid_micros: toMicros(budget / 2),
        },
      },
    ];

    const adGroupResult = await this.customer.mutateResources(adGroupOperations);
    const adGroupResource =
      adGroupResult.mutate_operation_responses?.[0]?.ad_group_result
        ?.resource_name;

    if (!adGroupResource) {
      throw new Error("Failed to create ad group.");
    }

    // Create keywords
    let keywordResources: string[] = [];

    if (keywords.length > 0) {
      const keywordOps: MutateOperation<resources.IAdGroupCriterion>[] =
        keywords.map((kw: string) => ({
          entity: "ad_group_criterion",
          operation: "create",
          resource: {
            ad_group: adGroupResource,
            status: enums.AdGroupCriterionStatus.ENABLED,
            keyword: {
              text: kw,
              match_type: enums.KeywordMatchType.BROAD,
            },
          },
        }));

      const keywordResult = await this.customer.mutateResources(keywordOps);

      keywordResources =
        keywordResult.mutate_operation_responses?.map(
          (k: any) => k.ad_group_criterion_result?.resource_name
        ) || [];
    }

    // Create RSA
    if (finalUrl && headlines?.length && descriptions?.length) {
      await this.customer.mutateResources([
        {
          entity: "ad_group_ad",
          operation: "create",
          resource: {
            ad_group: adGroupResource,
            status: enums.AdGroupAdStatus.PAUSED,
            ad: {
              final_urls: [finalUrl],
              responsive_search_ad: {
                headlines: headlines.map((h: string) => ({ text: h })),
                descriptions: descriptions.map((d: string) => ({ text: d })),
              },
            },
          },
        },
      ]);
    }

    return {
      campaign: campaignResource,
      adGroup: adGroupResource,
    };
  }
}
