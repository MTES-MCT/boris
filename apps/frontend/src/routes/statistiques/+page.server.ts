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
      ...{
        '75': 423,
        '13': 190,
        '28': 8,
        '01': 27,
        '39': 6,
        '93': 184,
        '974': 45,
        '19': 4,
        '25': 19,
        '14': 28,
        '94': 177,
        '02': 4,
        '95': 110,
        '79': 3,
        '64': 76,
        '34': 158,
        '07': 4,
        '18': 6,
        '32': 2,
        '38': 100,
        '68': 14,
        '76': 82,
        '971': 93,
        '74': 242,
        '58': 1,
        '37': 20,
        '33': 305,
        '30': 36,
        '2A': 6,
        '66': 17,
        '45': 30,
        '61': 3,
        '92': 215,
        '51': 10,
        '46': 2,
        '53': 3,
        '27': 14,
        '11': 4,
        '31': 103,
        '09': 4,
        '43': 2,
        '60': 35,
        '82': 4,
        '42': 15,
        '08': 5,
        '62': 38,
        '49': 31,
        '80': 22,
        '67': 36,
        '972': 17,
        '69': 250,
        '12': 4,
        '10': 6,
        '54': 19,
        '06': 135,
        '88': 4,
        '03': 7,
        '47': 11,
        '55': 1,
        '52': 2,
        '86': 14,
        '85': 29,
        '40': 39,
        '73': 40,
        '81': 5,
        '65': 6,
        '976': 1,
        '44': 122,
        '91': 90,
        '59': 98,
        '77': 125,
        '2B': 7,
        '87': 6,
        '05': 5,
        '29': 23,
        '57': 14,
        '973': 9,
        '21': 14,
        '24': 8,
        '56': 89,
        '17': 41,
        '83': 92,
        '78': 106,
        '35': 150,
        '04': 6,
        '41': 1,
        '22': 28,
        '50': 12,
        '16': 5,
        '90': 4,
        '89': 4,
        '26': 19,
        '63': 13,
        '84': 19,
        '71': 11,
        '70': 2,
        '72': 12,
      },
    },
  };
};
