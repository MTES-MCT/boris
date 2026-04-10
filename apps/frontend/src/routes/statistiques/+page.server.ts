import {
  defaultDepartementsCodesRecord,
  defaultRegionsCodesRecord,
  regionCodesAcronymsMatching,
} from '$lib/utils/constants';
import type { EligibilityStatsItem } from '$lib/types/statistics';
import type { components } from '$lib/utils/generated-api-types';
import type { PageServerLoad } from './$types';

type PageData = {
  simulationsMonthlySummary: {
    data: {
      year: string;
      month: string;
      count: string;
    }[];
  };
  investedAmount: number;
  purchasePlanAmount: string;
  eligibility: EligibilityStatsItem[];
  countSimulations: number;
  householdsData: ReturnType<typeof formatHouseholdsStatsData>;
  ofssAmount: number;
  departementalConnectionCount: Record<string, number>;
  regionalConnectionCount: Record<string, number>;
  conversionFunnel: ReturnType<typeof formatConversionFunnel>;
  acquisitionSimulationsConversionFunnel: ReturnType<
    typeof formatAcquisitionSimulationsConversionFunnel
  >;
};

const getCountByEligibilityBucket = (
  items: EligibilityStatsItem[],
): Record<EligibilityStatsItem['eligibility'], number> => {
  return items.reduce<Record<EligibilityStatsItem['eligibility'], number>>(
    (accumulator, item) => {
      accumulator[item.eligibility] = Number(item.count);

      return accumulator;
    },
    {
      A_AND_ABIS: 0,
      B1: 0,
      B2_AND_C: 0,
      NONE: 0,
    },
  );
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const partnerOfssResponse = await fetch('api/ofss/partner', {
    cache: 'no-store',
  });
  const partnerOfss = await partnerOfssResponse.json();

  const eligibilityRespone = await fetch(
    'api/eligibility-simulations/eligibility',
    {
      cache: 'no-store',
    },
  );
  const eligibility = await eligibilityRespone.json();

  const simulationsMonthlySummaryResponse = await fetch(
    'api/eligibility-simulations/simulations/monthly-summary',
    { cache: 'no-store' },
  );
  const simulationsMonthlySummary =
    await simulationsMonthlySummaryResponse.json();

  const brsKnowledgeResponse = await fetch(
    'api/eligibility-simulations/brs-knowledge',
    { cache: 'no-store' },
  );
  const brsKnowledge = await brsKnowledgeResponse.json();

  const realEstateSituationResponse = await fetch(
    'api/eligibility-simulations/real-estate-situation',
    { cache: 'no-store' },
  );
  const realEstateSituation = await realEstateSituationResponse.json();

  const simulationsByDepartementsResponse = await fetch(
    'api/eligibility-simulations/simulations/by-departements',
    { cache: 'no-store' },
  );

  const simulationsByDepartements =
    await simulationsByDepartementsResponse.json();

  const simulationsByRegionsResponse = await fetch(
    'api/eligibility-simulations/simulations/by-regions',
    { cache: 'no-store' },
  );

  const conversionFunnelResponse = await fetch(
    'api/eligibility-simulations/conversion-funnel',
    { cache: 'no-store' },
  );

  if (!conversionFunnelResponse.ok) {
    const message = await conversionFunnelResponse.text();

    throw new Error(message || 'Unable to load eligibility conversion funnel');
  }

  const conversionFunnel = await conversionFunnelResponse.json();

  const acquisitionSimulationsConversionFunnelResponse = await fetch(
    'api/acquisition-simulations/conversion-funnel',
    { cache: 'no-store' },
  );
  const acquisitionSimulationsConversionFunnel =
    await acquisitionSimulationsConversionFunnelResponse.json();

  const simulationsByRegions = await simulationsByRegionsResponse.json();
  const eligibilityCountByBucket = getCountByEligibilityBucket(
    eligibility.data,
  );

  return {
    investedAmount: 380000,
    purchasePlanAmount: '100 à 150',
    eligibility: eligibility.data,
    countSimulations:
      eligibilityCountByBucket.A_AND_ABIS +
      eligibilityCountByBucket.B1 +
      eligibilityCountByBucket.B2_AND_C +
      eligibilityCountByBucket.NONE,
    simulationsMonthlySummary,
    householdsData: formatHouseholdsStatsData(
      brsKnowledge.data,
      realEstateSituation.data,
    ),
    ofssAmount: partnerOfss.totalCount,
    regionalConnectionCount: {
      ...defaultRegionsCodesRecord,
      ...formatSimulationsByRegions(simulationsByRegions.data),
    },
    departementalConnectionCount: {
      ...defaultDepartementsCodesRecord,
      ...formatSimulationsByDepartements(simulationsByDepartements.data),
    },
    conversionFunnel: formatConversionFunnel(conversionFunnel),
    acquisitionSimulationsConversionFunnel:
      formatAcquisitionSimulationsConversionFunnel(
        acquisitionSimulationsConversionFunnel,
      ),
  };
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
): {
  total: number;
  brsUnawarePercentage: number;
  totalsRealEstateSituation: {
    realEstateSituation: string;
    count: string;
  }[];
} => {
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

const formatSimulationsByDepartements = (
  items: { departementCode: string; count: string }[],
): Record<string, number> => {
  const formattedItems: Record<string, number> = {};

  items.forEach((item) => {
    formattedItems[item.departementCode] = Number(item.count);
  });

  return formattedItems;
};

const formatSimulationsByRegions = (
  items: { regionName: string; regionCode: string; count: string }[],
): Record<string, number> => {
  const formattedItems: Record<string, number> = {};

  items.forEach((item) => {
    const regionAcronym = regionCodesAcronymsMatching[item.regionCode];
    formattedItems[regionAcronym] = Number(item.count);
  });

  return formattedItems;
};

const formatConversionFunnel = (conversionFunnel: {
  totalSimulations: number;
  totalHouseholdProvided: number;
  totalEligible: number;
  totalConnectionWish: number;
  totalEmailProvided: number;
  totalDesiredCityProvided: number;
}): {
  title: string;
  value: number;
  conversionRate: number;
  totalRespondantsRate: number;
  terminations: number;
  terminationRate: number;
}[] => {
  const initialData = [
    {
      title: 'Démarre la simulation',
      value: conversionFunnel.totalSimulations,
    },
    {
      title: 'Donne la composition de son foyer (taille, âge, handicap)',
      value: conversionFunnel.totalHouseholdProvided,
    },
    {
      title: 'Donne son RFR et obtient son résultat de simulation',
      value: conversionFunnel.totalEligible,
    },
    {
      title: 'Souhaite être recontacté',
      value: conversionFunnel.totalConnectionWish,
      conversions: conversionFunnel.totalEmailProvided,
    },
    {
      title: 'Donne son email, nom et prénom',
      value: conversionFunnel.totalEmailProvided,
      conversions: conversionFunnel.totalDesiredCityProvided,
    },
    {
      title:
        'Donne son département et sa ville de recherche et a ses coordonnées transmises aux OFS',
      value: conversionFunnel.totalDesiredCityProvided,
    },
  ];

  return initialData.map((item, index) => {
    const isFirst = index === 0;

    const { value } = item;
    const { value: initialRespondantsAmount } = initialData[0];

    let conversionRate = 0;
    let totalRespondantsRate = 0;
    let terminations = 0;
    let terminationRate = 0;

    if (!isFirst) {
      const { value: previousValue } = initialData[index - 1];

      conversionRate = (value / previousValue) * 100;
      totalRespondantsRate = (value / initialRespondantsAmount) * 100;
      terminations = previousValue - value;
      terminationRate = 100 - conversionRate;
    }

    return {
      ...item,
      conversionRate,
      totalRespondantsRate,
      terminations,
      terminationRate,
    };
  });
};

const formatAcquisitionSimulationsConversionFunnel = (
  conversionFunnel: components['schemas']['AcquisitionSimulationCalculateFunnelConversionView'],
): {
  title: string;
  value: number;
  conversionRate: number;
  totalRespondantsRate: number;
  terminations: number;
  terminationRate: number;
}[] => {
  const initialData = [
    {
      title: 'Donne les informations du logement',
      value: conversionFunnel.totalHouseInformations,
    },
    {
      title: 'Donne le montant de l’apport',
      value: conversionFunnel.totalOwnContribution,
    },
    {
      title: 'Donne le montant des frais de notaires et frais ponctuels',
      value: conversionFunnel.totalBuyingFees,
    },
    {
      title: 'Donne les informations du crédit immobilier',
      value: conversionFunnel.totalLoanInformations,
    },
    {
      title: 'Donne les informations concernant la redevance BRS & charges',
      value: conversionFunnel.totalBrsHousingFees,
    },
  ];

  return initialData.map((item, index) => {
    const isFirst = index === 0;

    const { value } = item;
    const { value: initialRespondantsAmount } = initialData[0];

    let conversionRate = 0;
    let totalRespondantsRate = 0;
    let terminations = 0;
    let terminationRate = 0;

    if (!isFirst) {
      const { value: previousValue } = initialData[index - 1];

      conversionRate = (value / previousValue) * 100;
      totalRespondantsRate = (value / initialRespondantsAmount) * 100;
      terminations = previousValue - value;
      terminationRate = 100 - conversionRate;
    }

    return {
      ...item,
      conversionRate,
      totalRespondantsRate,
      terminations,
      terminationRate,
    };
  });
};
