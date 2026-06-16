import { API_URL } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url }) => {
  const body = await request.json();

  const response = await fetch(
    `${API_URL}/embed/eligibility-simulations?${url.searchParams.toString()}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    },
  );

  const data = await response.json();

  if (response.status !== 201) {
    return error(
      response.status,
      Array.isArray(data.message) ? data.message.join(', ') : data.message,
    );
  }

  return json(data);
};
