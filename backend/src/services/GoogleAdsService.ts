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

const GEO_TARGETS: Record<string, string[]> = {
  all: ["geoTargetConstants/2840"], // All countries & territories
  us: ["geoTargetConstants/2840"],  // United States
  us_ca: [
    "geoTargetConstants/2840", // United States
    "geoTargetConstants/2124", // Canada
  ],
};

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
        ORDER BY campaign.start_date DESC
        LIMIT 10
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

  async getAdGroups(campaignId: string) {
    try {
      const customerId = this.customer.credentials.customer_id;

      const resourceName = `customers/${customerId}/campaigns/${campaignId}`;
  
      const query = `
        SELECT
          ad_group.id,
          ad_group.name
        FROM ad_group
        WHERE ad_group.campaign = '${resourceName}'
          AND ad_group.status != 'REMOVED'
        ORDER BY ad_group.id DESC
      `;
  
      const data = await this.customer.query(query);
  
      return data.map((item: any) => ({
        id: item.ad_group.id,
        name: item.ad_group.name,
      }));
    } catch (err) {
      console.error("Google API Error:", err);
      throw new Error("Failed to fetch ad groups");
    }
  }

  // Create campaign workflow
  async createCampaign(payload: any) {
    const { name, budget, location, broadKeywords = [], phraseKeywords = [], exactKeywords = [] } = payload;
  
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

    const locationOps: MutateOperation<resources.ICampaignCriterion>[] = [];

    const geoTargets = GEO_TARGETS[location];

    if (!geoTargets) {
      throw new Error(`Invalid location value: ${location}`);
    }

    geoTargets.forEach((geo) => {
      locationOps.push({
        entity: "campaign_criterion",
        operation: "create",
        resource: {
          campaign: campaignResource,
          location: {
            geo_target_constant: geo,
          },
        },
      });
    });

    if (locationOps.length > 0) {
      await this.customer.mutateResources(locationOps);
    }
  
    return {
      campaign: campaignResource,
      locationTargeting: location,
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
            cpc_bid_micros: Math.round(g.cpcBid * 1_000_000),
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
      let createdKeywordResources: any[] = [];

      if (keywordOperations.length > 0) {
        const kwResult = await this.customer.mutateResources(keywordOperations);
  
        if (!kwResult.mutate_operation_responses?.length) {
          throw new Error("Keyword creation failed.");
        }

        createdKeywordResources = kwResult.mutate_operation_responses
        .map((r: any) => r?.ad_group_criterion_result?.resource_name)
        .filter(Boolean);
      }

      //----------------------------------------------------
      // SUCCESS RESULT
      //----------------------------------------------------
      return {
        message: "Ad groups and keywords created successfully",
        adGroups: createdAdGroupResources,
        keywords: createdKeywordResources, //customers/6132954200/adGroupCriteria/191808445602~22856300
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

      const createdAdResources = response.mutate_operation_responses
        .map((r: any) => r?.ad_group_ad_result?.resource_name)
        .filter(Boolean);
  
      return {
        message: "Ads created successfully",
        ads: createdAdResources, //customers/6132954200/adGroupAds/193436236274~788972330525
      };
    } catch (err: any) {
      console.error("Bulk A Creation Error:", err);
      throw new Error(err.message || "Failed to create ads");
    }
  }

  async createNegativeKeywords(payloads: any[]) {
    const customerId = this.customer.credentials.customer_id;
  
    //--------------------------------------------------
    // Build ALL Negative Keyword Operations
    //--------------------------------------------------
    const operations: MutateOperation<
      resources.ICampaignCriterion | resources.IAdGroupCriterion
    >[] = [];
  
    const buildOps = (
      level: 1 | 2,
      resourceName: string,
      keywords: string[],
      matchType: enums.KeywordMatchType
    ) => {
      keywords.forEach(kw => {
        operations.push({
          entity: level === 1
            ? "campaign_criterion"
            : "ad_group_criterion",
          operation: "create",
          resource: {
            ...(level === 1
              ? { campaign: resourceName }
              : { ad_group: resourceName }),
            negative: true,
            keyword: {
              text: kw,
              match_type: matchType,
            },
          },
        });
      });
    };
  
    payloads.forEach(item => {
      const campaignResource = `customers/${customerId}/campaigns/${item.campaignId}`;
  
      const adGroupResource =
        item.level === 2 && item.adGroupId
          ? `customers/${customerId}/adGroups/${item.adGroupId}`
          : null;
  
      if (item.level === 2 && !adGroupResource) {
        throw new Error("AdGroup level requires adGroupId");
      }
  
      buildOps(
        item.level,
        item.level === 1 ? campaignResource : adGroupResource!,
        item.negativeKeywords.broad,
        enums.KeywordMatchType.BROAD
      );
  
      buildOps(
        item.level,
        item.level === 1 ? campaignResource : adGroupResource!,
        item.negativeKeywords.phrase,
        enums.KeywordMatchType.PHRASE
      );
  
      buildOps(
        item.level,
        item.level === 1 ? campaignResource : adGroupResource!,
        item.negativeKeywords.exact,
        enums.KeywordMatchType.EXACT
      );
    });
  
    //--------------------------------------------------
    // Execute Bulk Mutation
    //--------------------------------------------------
    let createdResources: string[] = [];
  
    if (operations.length > 0) {
      const result = await this.customer.mutateResources(operations);
  
      createdResources =
        result.mutate_operation_responses
          ?.map((r: any) =>
            r.campaign_criterion_result?.resource_name ||
            r.ad_group_criterion_result?.resource_name
          )
          .filter(Boolean) || [];
    }
  
    //--------------------------------------------------
    // Result
    //--------------------------------------------------
    return {
      totalItems: payloads.length,
      totalKeywordsCreated: createdResources.length,
      resources: createdResources,
    };
  }

  private async createImageAsset(
    customerId: string,
    buffer: Buffer,
    name: string
  ) {
    const result = await this.customer.mutateResources([
      {
        entity: "asset",
        operation: "create",
        resource: {
          name,
          type: enums.AssetType.IMAGE,
          image_asset: {
            data: buffer,
          },
        },
      },
    ]);
  
    return result.mutate_operation_responses?.[0]?.asset_result?.resource_name;
  }
  

  private async createTextAsset(
    text: string,
    type: enums.AssetFieldType
  ) {
    const result = await this.customer.mutateResources([
      {
        entity: "asset",
        operation: "create",
        resource: {
          type,
          text_asset: { text },
        },
      },
    ]);
  
    return result.mutate_operation_responses?.[0]?.asset_result?.resource_name;
  }
  

  async createPerformanceMaxCampaign(payload: any) {
    const customerId = this.customer.credentials.customer_id;
  
    const {
      name,
      budget,
      finalUrl,
      headlines,
      descriptions,
      images,
    } = payload;
  
    /* -------------------------
     * 1. Budget + Campaign
     * ------------------------- */
    const budgetResource = ResourceNames.campaignBudget(customerId, "-1");
  
    const campaignResult = await this.customer.mutateResources([
      {
        entity: "campaign_budget",
        operation: "create",
        resource: {
          resource_name: budgetResource,
          amount_micros: toMicros(budget),
          explicitly_shared: false,
        },
      },
      {
        entity: "campaign",
        operation: "create",
        resource: {
          name,
          advertising_channel_type:
            enums.AdvertisingChannelType.PERFORMANCE_MAX,
          status: enums.CampaignStatus.PAUSED,
          campaign_budget: budgetResource,
          maximize_conversions: {},
          contains_eu_political_advertising:
            enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
        },
      }
    ]);
  
    const campaignResource =
      campaignResult.mutate_operation_responses?.[1]?.campaign_result
        ?.resource_name;
  
    if (!campaignResource) {
      throw new Error("Failed to create Performance Max campaign");
    }
  
    /* -------------------------
     * 2. REQUIRED Brand Assets
     * ------------------------- */
  
    // BUSINESS NAME (REQUIRED)
    const businessNameAsset = await this.createTextAsset(
      name,
      enums.AssetFieldType.BUSINESS_NAME
    );
  
    // SQUARE LOGO (REQUIRED)
    if (!images?.square) {
      throw new Error("Square logo is required for Performance Max");
    }
  
    const squareLogoAsset = await this.createImageAsset(
      customerId,
      images.square,
      `${name} Square Logo`
    );
  
    /* -------------------------
     * 3. Link assets to campaign
     * ------------------------- */
    const campaignAssetOps: MutateOperation<any>[] = [
      {
        entity: "campaign_asset",
        operation: "create",
        resource: {
          campaign: campaignResource,
          asset: businessNameAsset,
          field_type: enums.AssetFieldType.BUSINESS_NAME,
        },
      },
      {
        entity: "campaign_asset",
        operation: "create",
        resource: {
          campaign: campaignResource,
          asset: squareLogoAsset,
          field_type: enums.AssetFieldType.LOGO,
        },
      },
    ];
  
    await this.customer.mutateResources(campaignAssetOps);
  
    /* -------------------------
     * 4. Optional: Headlines
     * ------------------------- */
    for (const text of headlines || []) {
      const asset = await this.createTextAsset(
        text,
        enums.AssetFieldType.HEADLINE
      );
  
      await this.customer.mutateResources([
        {
          entity: "campaign_asset",
          operation: "create",
          resource: {
            campaign: campaignResource,
            asset,
            field_type: enums.AssetFieldType.HEADLINE,
          },
        },
      ]);
    }
  
    /* -------------------------
     * 5. Optional: Descriptions
     * ------------------------- */
    for (const text of descriptions || []) {
      const asset = await this.createTextAsset(
        text,
        enums.AssetFieldType.DESCRIPTION
      );
  
      await this.customer.mutateResources([
        {
          entity: "campaign_asset",
          operation: "create",
          resource: {
            campaign: campaignResource,
            asset,
            field_type: enums.AssetFieldType.DESCRIPTION,
          },
        },
      ]);
    }
  
    /* -------------------------
     * DONE
     * ------------------------- */
    return {
      campaign: campaignResource,
      assets: {
        businessName: businessNameAsset,
        squareLogo: squareLogoAsset,
      },
    };
  }
  
}
