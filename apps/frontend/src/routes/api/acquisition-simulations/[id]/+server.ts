import { API_URL, API_KEY } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, params }) => {
  const { id } = params;
  const body = await request.json();

  const response = await fetch(`${API_URL}/acquisition-simulations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'x-api-key': API_KEY,
      'content-type': 'application/json',
    },
  });

  if (response.status !== 200) {
    return error(response.status);
  }

  const acquisitionSimulation = await response.json();

  return json(acquisitionSimulation);
};
