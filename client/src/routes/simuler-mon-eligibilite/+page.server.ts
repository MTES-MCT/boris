import type { PageServerLoad } from './$types';
import type { Data } from './definitions';
import { LANDBOT_CONFIG_URL } from '$env/static/private';

export const load: PageServerLoad = () => {
  const data: Data = {
    landbotConfigUrl: LANDBOT_CONFIG_URL,
  };

  return data;
};
