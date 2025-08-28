import { PUBLIC_API_URL } from '$env/static/public';
import type { Pagination, BrsDiffusionWebsiteView } from '$lib/utils/api-types';
import type { operations } from '$lib/utils/generated-api-types';

export const getBrsDiffusionWebsites = async (
  query?: operations['GetBrsDiffusionWebsitesApiController_index']['parameters']['query'],
): Promise<Pagination<BrsDiffusionWebsiteView>> => {
  const url = new URL(`${PUBLIC_API_URL}/brs-diffusion-websites`);

  if (query?.page) {
    url.searchParams.set('page', query.page.toString());
  }

  if (query?.pageSize) {
    url.searchParams.set('pageSize', query.pageSize.toString());
  }

  if (query?.latitude && query?.longitude) {
    url.searchParams.set('latitude', query.latitude.toString());
    url.searchParams.set('longitude', query.longitude.toString());
  }

  if (query?.radius) {
    url.searchParams.set('radius', query.radius.toString());
  }

  const response = await fetch(url);
  const data: Pagination<BrsDiffusionWebsiteView> = await response.json();

  return data;
};

export const getBrsDiffusionWebsitesByBounds = async (query: operations['GetBrsDiffusionWebsitesByBoundsApiController_index']['parameters']['query']) => {
  const url = new URL(`${PUBLIC_API_URL}/brs-diffusion-websites-by-bounds`);

  if (query?.page) {
    url.searchParams.set('page', query.page.toString());
  }

  url.searchParams.set('northEastLat', query.northEastLat.toString())
  url.searchParams.set('northEastLng', query.northEastLng.toString())
  url.searchParams.set('southWestLat', query.southWestLat.toString())
  url.searchParams.set('southWestLng', query.southWestLng.toString())

  const response = await fetch(url);
  const data: Pagination<BrsDiffusionWebsiteView> = await response.json()

  return data
}