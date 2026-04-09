import type { EligibilityStatsItem } from '$lib/types/statistics';
import type { PageServerLoad } from './$types';

type PageData = {
  investedAmount: number;
  purchasePlanAmount: string;
  eligibility: EligibilityStatsItem[];
  householdsData: {
    total: number;
    brsUnawarePercentage: number;
    totalsRealEstateSituation: {
      realEstateSituation: string;
      count: string;
    }[];
  };
  ofssAmount: number;
};

const formatHouseholdsStatsData = (
  brsKnowledge: {
    brsKnowledge: 'Oui' | 'Non' | 'Je ne suis pas sûr·e' | null;
    count: string;
  }[],
  realEstateSituation: {
    realEstateSituation:
      | "propriétaire d'un logement"
      | "locataire d'un logement social"
      | "locataire d'un logement privé"
      | 'hebergé·e'
      | 'dans une autre situation immobilière'
      | null;
    count: string;
  }[],
) => {
  const totalsRealEstateSituation: {
    realEstateSituation: string;
    count: string;
  }[] = [];

  const total = brsKnowledge.reduce((sum, item) => sum + Number(item.count), 0);

  const totalUnawareOfBrs = brsKnowledge
    .filter((item) => item.brsKnowledge === 'Non')
    .reduce((sum, item) => sum + Number(item.count), 0);

  realEstateSituation.forEach((item) => {
    if (
      item.realEstateSituation !== null &&
      item.realEstateSituation !== 'dans une autre situation immobilière'
    ) {
      totalsRealEstateSituation.push({
        realEstateSituation: item.realEstateSituation,
        count: Math.round((Number(item.count) / total) * 100).toString(),
      });
    }
  });

  totalsRealEstateSituation.push({
    realEstateSituation: 'dans une autre situation immobilière',
    count: (
      100 -
      totalsRealEstateSituation.reduce(
        (sum, item) => sum + Number(item.count),
        0,
      )
    ).toString(),
  });

  return {
    total,
    brsUnawarePercentage: total === 0 ? 0 : (totalUnawareOfBrs / total) * 100,
    totalsRealEstateSituation,
  };
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const response = await fetch('api/ofss/partner', { cache: 'no-store' });
  const partnerOfss = await response.json();

  const eligibilityRespone = await fetch(
    'api/eligibility-simulations/eligibility',
    {
      cache: 'no-store',
    },
  );
  const eligibility = await eligibilityRespone.json();

  const brsKnowledgeResponse = await fetch(
    'api/eligibility-simulations/brs-knowledge',
  );
  const brsKnowledge = await brsKnowledgeResponse.json();

  const realEstateSituationResponse = await fetch(
    'api/eligibility-simulations/real-estate-situation',
  );
  const realEstateSituation = await realEstateSituationResponse.json();

  return {
    investedAmount: 380000,
    purchasePlanAmount: '100 à 150',
    eligibility: eligibility.data,
    householdsData: formatHouseholdsStatsData(
      brsKnowledge.data,
      realEstateSituation.data,
    ),
    ofssAmount: partnerOfss.totalCount,
  };
};
