import Keyv from 'keyv';

export const namespaces = {
  ofss: 'ofss',
  partnerOfss: 'partner-ofss',
  brsDiffusionWebsites: 'brs-diffusion-websites',
  municipalities: 'municipalities',
  eligibilitySimulationsEligibility: 'eligibility-simulations-eligibility',
  eligibilitySimulationsBrsKnowledge: 'eligibility-simulations-brs-knowledge',
  eligibilitySimulationsRealEstateSituation:
    'eligibility-simulations-real-estate-situation',
  eligibilitySimulationsMonthlySummary:
    'eligibility-simulations-monthly-summary',
  eligibilitySimulationsByDepartements:
    'eligibility-simulations-by-departements',
  eligibilitySimulationsByRegions: 'eligibility-simulations-by-regions',
  eligibilitySimulationsConversionFunnel:
    'eligibility-simulations-conversion-funnel',
  acquisitionSimulationsConversionFunnel:
    'acquisition-simulations-conversion-funnel',
};

const TTL_HOURS = 12;
const TTL_MINS = 60;
export const TTL_MS = TTL_HOURS * TTL_MINS * 60 * 1000;

const keyv = new Keyv({ ttl: TTL_MS });

export default keyv;
