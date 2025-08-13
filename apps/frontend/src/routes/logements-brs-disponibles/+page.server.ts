import { formatOfss } from '$lib/utils/formatters';
import type { Region } from '$lib/utils/definitions';
import type { PageServerLoad } from './$types';
import { getOfss } from '$lib/api/ofss';

export type DataType = {
  regions: Region[];
};

export const load: PageServerLoad = async (): Promise<DataType> => {
  const ofss = await getOfss();

  const data = {
    regions: formatOfss(ofss.items),
  };

  return data;
};

export const prerender = false;
