import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  const fetchUrl = new URL(`${API_URL}/brs-diffusion-websites`);

  const { searchParams } = url;

  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const radius = searchParams.get('radius');

  if (page) {
    fetchUrl.searchParams.set('page', page);
  }

  if (pageSize) {
    fetchUrl.searchParams.set('pageSize', pageSize);
  }

  if (latitude && longitude) {
    fetchUrl.searchParams.set('latitude', latitude);
    fetchUrl.searchParams.set('longitude', longitude);
  }

  if (radius) {
    fetchUrl.searchParams.set('radius', radius);
  }

  const response = await fetch(fetchUrl);
  const data = await response.json();

  return json(data);
};
