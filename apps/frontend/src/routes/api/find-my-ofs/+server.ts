import { API_KEY, API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const GET = async ({ url, fetch }) => {
  const address = url.searchParams.get('address');
  const radius = url.searchParams.get('radius') || '10';

  if (!address) {
    return json({ message: 'Adresse manquante' }, { status: 400 });
  }

  const fetchUrl = new URL(`${API_URL}/ofss/find-my-ofs`);
  fetchUrl.searchParams.set('address', address);
  fetchUrl.searchParams.set('radius', radius);

  const response = await fetch(fetchUrl, {
    headers: {
      'x-api-key': API_KEY,
    },
  });

  return json(await response.json(), { status: response.status });
};
