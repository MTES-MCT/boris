// Backend de test déterministe, uniquement local. Aucune donnée de production.
import { createServer } from 'node:http';

const region = { id: 'region-test', name: 'Bretagne', code: '53' };
const departement = {
  id: 'departement-test',
  name: 'Ille-et-Vilaine',
  code: '35',
};
const programme = {
  id: 'programme-test',
  programName: 'Les Jardins de BoRiS',
  city: 'Rennes',
  zipcode: '35000',
  inseeCode: '35238',
  address: '12 rue de la Paix',
  latitude: 48.11,
  longitude: -1.68,
  source: 'https://example.org/programme',
  ofsName: 'OFS de test',
  housingType: 'new',
  region,
  departement,
};
const pagination = (items) => ({
  items,
  totalCount: items.length,
  page: 1,
  pageSize: 24,
  pagesCount: 1,
  hasNextPage: false,
  hasPreviousPage: false,
});
const ofss = pagination([
  {
    id: 'ofs-test',
    name: 'OFS de test',
    websiteUrl: 'https://example.org',
    producesBrs: true,
    regions: [region],
  },
  {
    id: 'ofs-test-sans-offre',
    name: 'OFS sans offre',
    producesBrs: false,
    regions: [region],
  },
]);
const fixtures = {
  '/api/ofss': ofss,
  '/api/eligibility-simulations/eligibility': {
    data: [
      { eligibility: 'A_AND_ABIS', count: '100' },
      { eligibility: 'NONE', count: '25' },
    ],
  },
  '/api/eligibility-simulations/brs-knowledge': {
    data: [
      { brsKnowledge: 'Non', count: '100' },
      { brsKnowledge: 'Oui', count: '25' },
    ],
  },
  '/api/eligibility-simulations/real-estate-situation': {
    data: [
      { realEstateSituation: "locataire d'un logement privé", count: '100' },
      { realEstateSituation: 'hebergé·e', count: '25' },
    ],
  },
  '/api/eligibility-simulations/simulations/monthly-summary': {
    data: [
      { year: '2025', month: '1', count: '10' },
      { year: '2025', month: '2', count: '20' },
      { year: '2026', month: '1', count: '30' },
      { year: '2026', month: '2', count: '40' },
      { year: '2026', month: '3', count: '50' },
    ],
  },
  '/api/eligibility-simulations/simulations/by-departements': {
    data: [{ departementCode: '35', count: '42' }],
  },
  '/api/eligibility-simulations/simulations/by-regions': {
    data: [{ regionCode: '53', regionName: 'Bretagne', count: '42' }],
  },
  '/api/eligibility-simulations/conversion-funnel': {
    totalSimulations: 100,
    totalHouseholdProvided: 90,
    totalEligible: 80,
    totalConnectionWish: 70,
    totalEmailProvided: 60,
    totalDesiredCityProvided: 50,
  },
  '/api/acquisition-simulations/conversion-funnel': {
    totalHouseInformations: 100,
    totalOwnContribution: 90,
    totalBuyingFees: 80,
    totalLoanInformations: 70,
    totalBrsHousingFees: 60,
  },
};

createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  response.setHeader('Content-Type', 'application/json');
  let data = fixtures[url.pathname];
  if (url.pathname === '/api/brs-diffusion-websites') {
    data = pagination(
      url.searchParams.has('latitude')
        ? [programme]
        : [
            programme,
            {
              ...programme,
              id: 'programme-bordeaux',
              programName: 'Programme de Bordeaux',
              city: 'Bordeaux',
              latitude: 44.84,
              longitude: -0.58,
            },
          ],
    );
  }
  if (data === undefined) {
    response.statusCode = 404;
    data = { message: 'Endpoint absent des fixtures RGAA' };
  }
  response.end(JSON.stringify(data));
}).listen(3181, '127.0.0.1', () => {
  console.log('Backend RGAA fictif : http://127.0.0.1:3181/api');
});
