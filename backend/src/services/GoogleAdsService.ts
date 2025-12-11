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
    const { name, budget, broadKeywords = [], phraseKeywords = [], exactKeywords = [] } = payload;
  
    const customerId = this.customer.credentials.customer_id;
  
    // -----------------------------
    // 1. Create Campaign Budget
    // -----------------------------
    const budgetResourceName = ResourceNames.campaignBudget(customerId, "-1");
  
    const operations: MutateOperation<
      resources.ICampaignBudget | resources.ICampaign
    >[] = [
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
  
    // -----------------------------------------
    // 2. Build ALL Negative Keywords Corrections
    // -----------------------------------------
    const negativeOps: MutateOperation<resources.ICampaignCriterion>[] = [];
  
    // BROAD NEGATIVES
    broadKeywords.forEach((kw: string) => {
      negativeOps.push({
        entity: "campaign_criterion",
        operation: "create",
        resource: {
          campaign: campaignResource,
          negative: true,
          keyword: {
            text: kw,
            match_type: enums.KeywordMatchType.BROAD,
          },
        },
      });
    });
  
    // PHRASE NEGATIVES
    phraseKeywords.forEach((kw: string) => {
      negativeOps.push({
        entity: "campaign_criterion",
        operation: "create",
        resource: {
          campaign: campaignResource,
          negative: true,
          keyword: {
            text: kw,
            match_type: enums.KeywordMatchType.PHRASE,
          },
        },
      });
    });
  
    // EXACT NEGATIVES
    exactKeywords.forEach((kw: string) => {
      negativeOps.push({
        entity: "campaign_criterion",
        operation: "create",
        resource: {
          campaign: campaignResource,
          negative: true,
          keyword: {
            text: kw,
            match_type: enums.KeywordMatchType.EXACT,
          },
        },
      });
    });
  
    // ---------------------------------------
    // 3. Create Campaign Negative Keywords
    // ---------------------------------------
    if (negativeOps.length > 0) {
      await this.customer.mutateResources(negativeOps);
    }
  
    return {
      campaign: campaignResource,
      negativeKeywordsAdded: {
        broad: broadKeywords,
        phrase: phraseKeywords,
        exact: exactKeywords,
      },
    };
  }  

  async createAdGroups(adGroups: any[]) {
    try {
      const customerId = this.customer.credentials.customer_id;
  
      //----------------------------------------------------
      // 1. Build Ad Group Mutation Operations
      //----------------------------------------------------
      const adGroupOperations: MutateOperation<resources.IAdGroup>[] = adGroups.map((g: any) => {
        const campaignResource = `customers/${customerId}/campaigns/${g.campaignId}`;
  
        return {
          entity: "ad_group",
          operation: "create",
          resource: {
            name: g.name,
            campaign: campaignResource,
            status: enums.AdGroupStatus.ENABLED,
            type: enums.AdGroupType.SEARCH_STANDARD,
            cpc_bid_micros: Math.round(g.defaultBid * 1_000_000),
          },
        };
      });
  
      //----------------------------------------------------
      // 2. EXECUTE AD GROUP CREATION
      //----------------------------------------------------
      const adGroupResult = await this.customer.mutateResources(adGroupOperations);
  
      if (!adGroupResult.mutate_operation_responses?.length) {
        throw new Error("Failed to create ad groups.");
      }
  
      const createdAdGroupResources = adGroupResult.mutate_operation_responses
        .map((r: any) => r?.ad_group_result?.resource_name)
        .filter(Boolean);
  
      if (createdAdGroupResources.length !== adGroups.length) {
        throw new Error("Mismatch: Some ad groups were not created.");
      }
  
      //----------------------------------------------------
      // 3. Build Keyword Operations For ALL Ad Groups
      //----------------------------------------------------
      const keywordOperations: MutateOperation<resources.IAdGroupCriterion>[] = [];
  
      createdAdGroupResources.forEach((adGroupResource: string, index: number) => {
        const group = adGroups[index];
  
        // Add Broad match keywords
        group.keywords.broad.forEach((kw: string) => {
          keywordOperations.push({
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
          });
        });
  
        // Add Phrase match keywords
        group.keywords.phrase.forEach((kw: string) => {
          keywordOperations.push({
            entity: "ad_group_criterion",
            operation: "create",
            resource: {
              ad_group: adGroupResource,
              status: enums.AdGroupCriterionStatus.ENABLED,
              keyword: {
                text: kw,
                match_type: enums.KeywordMatchType.PHRASE,
              },
            },
          });
        });
  
        // Add Exact match keywords
        group.keywords.exact.forEach((kw: string) => {
          keywordOperations.push({
            entity: "ad_group_criterion",
            operation: "create",
            resource: {
              ad_group: adGroupResource,
              status: enums.AdGroupCriterionStatus.ENABLED,
              keyword: {
                text: kw,
                match_type: enums.KeywordMatchType.EXACT,
              },
            },
          });
        });
      });
  
      //----------------------------------------------------
      // 4. EXECUTE KEYWORD CREATION IN ONE BULK CALL
      //----------------------------------------------------
      if (keywordOperations.length > 0) {
        const kwResult = await this.customer.mutateResources(keywordOperations);
  
        if (!kwResult.mutate_operation_responses?.length) {
          throw new Error("Keyword creation failed.");
        }
      }
  
      //----------------------------------------------------
      // SUCCESS RESULT
      //----------------------------------------------------
      return {
        message: "Ad groups and keywords created successfully",
        adGroups: createdAdGroupResources,
      };
  
    } catch (err: any) {
      console.error("Bulk AdGroup Creation Error:", err);
      throw new Error(err.message || "Failed to create ad groups");
    }
  }  

  async createAds(ads: any[]) {
    try {
      const customerId = this.customer.credentials.customer_id;
  
      const adOperations: MutateOperation<resources.IAdGroupAd>[] = ads.map(
        (ad: any) => {
          const adGroupResource = `customers/${customerId}/adGroups/${ad.adGroupId}`;
          const finalUrls = ad.finalUrl ? [ad.finalUrl] : [];
  
          return {
            entity: "ad_group_ad",
            operation: "create",
            resource: {
              ad_group: adGroupResource,
              status: enums.AdGroupAdStatus.PAUSED,
              ad: {
                final_urls: finalUrls,
                responsive_search_ad: {
                  headlines: ad.headlines.map((h: string) => ({ text: h })),
                  descriptions: ad.descriptions.map((d: string) => ({ text: d })),
                },
              },
            },
          };
        }
      );
  
      const response = await this.customer.mutateResources(adOperations);
  
      return {
        success: true,
        result: response.mutate_operation_responses?.map((r: any) => ({
          resource: r.ad_group_ad_result?.resource_name,
        })),
      };
    } catch (error: any) {
      console.error("Ad creation failed:", error);
      return {
        success: false,
        message: error.message || "Error creating ads",
      };
    }
  }  

}
