import {
  defaultDepartementsCodesRecord,
  defaultRegionsCodesRecord,
} from '$lib/utils/constants';
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
  eligibility: {
    eligibility: string;
    count: string;
  }[];
  countSimulations: number;
  brsKnowledge: {
    brsKnowledge: string;
    count: string;
  }[];
  realEstateSituation: {
    realEstateSituation: string;
    count: string;
  }[];
  ofssAmount: number;
  departementalConnectionCount: Record<string, number>;
  regionalConnectionCount: Record<string, number>;
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
  const partnerOfssResponse = await fetch('api/ofss/partner', {
    cache: 'no-store',
  });
  const partnerOfss = await partnerOfssResponse.json();

  const eligibilityRespone = await fetch('api/landbot-customers/eligibility', {
    cache: 'no-store',
  });
  const eligibility = await eligibilityRespone.json();

  const simulationsMonthlySummaryResponse = await fetch(
    'api/landbot-customers/simulations/monthly-summary',
    { cache: 'no-store' },
  );
  const simulationsMonthlySummary =
    await simulationsMonthlySummaryResponse.json();

  const brsKnowledgeResponse = await fetch(
    'api/landbot-customers/brs-knowledge',
    { cache: 'no-store' },
  );
  const brsKnowledge = await brsKnowledgeResponse.json();

  const realEstateSituationResponse = await fetch(
    'api/landbot-customers/real-estate-situation',
    { cache: 'no-store' },
  );
  const realEstateSituation = await realEstateSituationResponse.json();

  const simulationsByDepartementsResponse = await fetch(
    'api/landbot-customers/simulations/by-departements',
    { cache: 'no-store' },
  );

  const simulationsByDepartements =
    await simulationsByDepartementsResponse.json();

  return {
    investedAmount: 380000,
    purchasePlanAmount: '100 à 150',
    eligibility: eligibility.data,
    countSimulations: eligibility.data.reduce(
      (sum: number, item: { eligibility: string; count: string }) =>
        sum + Number(item.count),
      0,
    ),
    simulationsMonthlySummary,
    brsKnowledge: brsKnowledge.data,
    realEstateSituation: realEstateSituation.data,
    ofssAmount: partnerOfss.totalCount,
    regionalConnectionCount: {
      ...defaultRegionsCodesRecord,
      ...{
        IDF: 1430,
        '976': 1,
        PAC: 447,
        NAQ: 512,
        HDF: 197,
        ARA: 719,
        GES: 111,
        '972': 17,
        CVL: 65,
        NOR: 139,
        OCC: 345,
        PDL: 197,
        BRE: 290,
        '20R': 13,
        BFC: 61,
        '971': 93,
        '974': 45,
        '973': 9,
      },
    },
    departementalConnectionCount: {
      ...defaultDepartementsCodesRecord,
      ...formatSimulationsByDepartements(simulationsByDepartements.data),
    },
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
