import { API_URL, API_KEY } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import cache, { namespaces, TTL_MS } from '$lib/server/cache';
import type { GetLandbotCustomerByFieldsPathParams } from '$lib/utils/api-types';

export const GET = async ({ params }) => {
  const allowedFields: GetLandbotCustomerByFieldsPathParams[] = [
    'eligibility',
    'brs-knowledge',
    'real-estate-situation',
  ];

  const { field } = params;

  if (!allowedFields.includes(field as GetLandbotCustomerByFieldsPathParams)) {
    return error(404);
  }

  let cacheNamespace = 'landbotCustomers';

  if (field === 'eligibility') {
    cacheNamespace = namespaces.landbotCustomersEligibility;
  } else if (field === 'brs-knowledge') {
    cacheNamespace = namespaces.landbotCustomersBrsKnowledge;
  } else if (field === 'real-estate-situation') {
    cacheNamespace = namespaces.landbotCustomersRealEstateSituation;
  }

  let data = await cache.get(cacheNamespace);

  if (!data) {
    const response = await fetch(`${API_URL}/landbot-customers/${field}`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    data = await response.json();

    cache.set(cacheNamespace, data, TTL_MS);
  }

  return json(data);
};
