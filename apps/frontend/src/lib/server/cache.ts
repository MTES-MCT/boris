import Keyv from 'keyv';

export const namespaces = {
  ofss: 'ofss',
  brsDiffusionWebsites: 'brs-diffusion-websites',
};

const TTL_HOURS = 24;
const TTL_MINS = 60;
const TTL_MS = TTL_HOURS * TTL_MINS * 60 * 1000;

const keyv = new Keyv({ ttl: TTL_MS });

export default keyv;
