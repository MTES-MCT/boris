import Keyv from 'keyv';

export const namespaces = {
  ofss: 'ofss',
  partnerOfss: 'partner-ofss',
  brsDiffusionWebsites: 'brs-diffusion-websites',
  municipalities: 'municipalities',
  landbotCustomersEligibility: 'landbot-customers-eligibility',
  landbotCustomersBrsKnowledge: 'landbot-customers-brs-knowledge',
  landbotCustomersRealEstateSituation:
    'landbot-customers-real-estate-situation',
  landbotCustomersSimulationsMonthlySummary:
    'landbot-customers-simulations-monthly-summary',
  landbotCustomersSimulationsByDepartements:
    'landbot-customers-simulations-by-departements',
};

const TTL_HOURS = 12;
const TTL_MINS = 60;
export const TTL_MS = TTL_HOURS * TTL_MINS * 60 * 1000;

const keyv = new Keyv({ ttl: TTL_MS });

export default keyv;
