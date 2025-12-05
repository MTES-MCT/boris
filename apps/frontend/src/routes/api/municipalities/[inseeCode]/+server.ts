import { API_URL, API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';
import type { MunicipalityView } from '$lib/utils/api-types.js';

export const GET = async ({ params }) => {
  const municipalities: MunicipalityView[] =
    (await cache.get(namespaces.municipalities)) || [];

  const { inseeCode } = params;

  let municipality = municipalities.find(
    (municipality) => municipality.inseeCode === inseeCode,
  );

  if (!municipality) {
    const response = await fetch(`${API_URL}/municipalities/${inseeCode}`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    municipality = await response.json();
    municipalities.push(municipality as MunicipalityView);

    cache.set(namespaces.municipalities, municipalities, TTL_MS);
  }

  return json(municipality);
};
