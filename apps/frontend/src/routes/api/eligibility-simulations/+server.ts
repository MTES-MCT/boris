import { API_URL, API_KEY } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  console.log(body);

  const response = await fetch(`${API_URL}/eligibility-simulations`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'x-api-key': API_KEY,
      'content-type': 'application/json',
    },
  });

  const data = await response.json();

  if (response.status !== 201) {
    return error(response.status, data.message?.join(', '));
  }

  return json(data);
};
