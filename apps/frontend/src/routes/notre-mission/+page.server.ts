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

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/ofss/partner', { cache: 'no-store' });
  const partnerOfss = await response.json();

  const eligibilityRespone = await fetch('api/landbot-customers/eligibility', {
    cache: 'no-store',
  });
  const eligibility = await eligibilityRespone.json();

  const brsKnowledgeResponse = await fetch(
    'api/landbot-customers/brs-knowledge',
  );
  const brsKnowledge = await brsKnowledgeResponse.json();

  const realEstateSituationResponse = await fetch(
    'api/landbot-customers/real-estate-situation',
  );
  const realEstateSituation = await realEstateSituationResponse.json();

  return {
    investedAmount: 380000,
    purchasePlanAmount: '100 à 150',
    eligibility: eligibility.data,
    householdsData: formatHouseholdsData(
      brsKnowledge.data,
      realEstateSituation.data,
    ),
    ofssAmount: partnerOfss.totalCount,
  };
};
