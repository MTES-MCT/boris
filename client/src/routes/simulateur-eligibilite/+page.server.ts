import type { PageServerLoad } from './$types';
import { LANDBOT_CONFIG_URL } from '$env/static/private';

export const load: PageServerLoad = () => {
  return {
    landbotConfigUrl: LANDBOT_CONFIG_URL,
  };
};
