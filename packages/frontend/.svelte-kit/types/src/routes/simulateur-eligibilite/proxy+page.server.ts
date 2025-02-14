// @ts-nocheck
import type { PageServerLoad } from './$types';
import { LANDBOT_CONFIG_URL } from '$env/static/private';

export const load = () => {
  return {
    landbotConfigUrl: LANDBOT_CONFIG_URL,
  };
};
;null as any as PageServerLoad;