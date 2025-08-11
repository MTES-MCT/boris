import { API_URL } from '$env/static/private';
import type { Pagination, BrsDiffusionWebsiteView } from '$lib/utils/api-types';

export const getBrsDiffusionWebsites = async (): Promise<
  Pagination<BrsDiffusionWebsiteView>
> => {
  const response = await fetch(`${API_URL}/brs-diffusion-websites`);
  const data: Pagination<BrsDiffusionWebsiteView> = await response.json();

  return data;
};
