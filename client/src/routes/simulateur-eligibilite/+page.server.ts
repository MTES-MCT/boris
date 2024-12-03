import type { PageServerLoad } from './$types';
import type { Data } from './definitions';
import { LANDBOT_CONFIG_URL } from '$env/static/private';

export const load: PageServerLoad = (): Data => {
  return {
    landbotConfigUrl: LANDBOT_CONFIG_URL,
  };
};
