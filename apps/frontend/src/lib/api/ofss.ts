import { PUBLIC_API_URL } from '$env/static/public';
import type { Pagination, OfsView } from '$lib/utils/api-types';

export const getOfss = async (): Promise<Pagination<OfsView>> => {
  const response = await fetch(`${PUBLIC_API_URL}/ofss`);
  const data: Pagination<OfsView> = await response.json();

  return data;
};
