import { API_URL } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, params, url }) => {
  const body = await request.json();

  const response = await fetch(
    `${API_URL}/embed/eligibility-simulations/${params.id}?${url.searchParams.toString()}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    },
  );

  const data = await response.json();

  if (response.status !== 200) {
    return error(
      response.status,
      Array.isArray(data.message) ? data.message.join(', ') : data.message,
    );
  }

  return json(data);
};
