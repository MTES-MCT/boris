import { formatHouseholdsData } from '$lib/utils/helpers';
import type { PageServerLoad } from './$types';

type PageData = {
  investedAmount: number;
  purchasePlanAmount: string;
  eligibility: {
    eligibility: string;
    count: string;
  }[];
  householdsData: ReturnType<typeof formatHouseholdsData>;
  ofssAmount: number;
};

export const prerender = false;

const defaultPageData: PageData = {
  investedAmount: 380000,
  purchasePlanAmount: '100 à 150',
  eligibility: [],
  householdsData: formatHouseholdsData([], []),
  ofssAmount: 0,
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  try {
    const response = await fetch('api/ofss/partner', { cache: 'no-store' });
    const partnerOfss = response.ok ? await response.json() : { totalCount: 0 };

    const eligibilityResponse = await fetch(
      'api/landbot-customers/eligibility',
      { cache: 'no-store' },
    );
    const eligibility = eligibilityResponse.ok
      ? await eligibilityResponse.json()
      : { data: [] };

    const brsKnowledgeResponse = await fetch(
      'api/landbot-customers/brs-knowledge',
    );
    const brsKnowledge = brsKnowledgeResponse.ok
      ? await brsKnowledgeResponse.json()
      : { data: [] };

    const realEstateSituationResponse = await fetch(
      'api/landbot-customers/real-estate-situation',
    );
    const realEstateSituation = realEstateSituationResponse.ok
      ? await realEstateSituationResponse.json()
      : { data: [] };

    return {
      investedAmount: 380000,
      purchasePlanAmount: '100 à 150',
      eligibility: eligibility.data ?? [],
      householdsData: formatHouseholdsData(
        brsKnowledge.data ?? [],
        realEstateSituation.data ?? [],
      ),
      ofssAmount: partnerOfss.totalCount ?? 0,
    };
  } catch {
    return defaultPageData;
  }
};
