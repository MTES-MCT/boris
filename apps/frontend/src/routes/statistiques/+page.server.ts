import type { PageServerLoad } from './$types';
import type { LandbotCustomerGroupSimulationsByYearAndMonthView } from '$lib/utils/api-types';

type PageData = {
  countSimulations: number;
  simulationsMonthlySummary: {
    data: {
      year: string;
      month: string;
      count: string;
    }[];
  };
};

export const load: PageServerLoad = async ({ fetch }): Promise<PageData> => {
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

  return {
    countSimulations: eligibility.data.reduce(
      (sum: number, item: { eligibility: string; count: string }) =>
        sum + Number(item.count),
      0,
    ),
    simulationsMonthlySummary,
  };
};
