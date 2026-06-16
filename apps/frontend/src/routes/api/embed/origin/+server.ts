import { API_URL } from '$env/static/private';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const response = await fetch(
    `${API_URL}/embed/origin?${url.searchParams.toString()}`,
  );
  const data = await response.json();

  if (!response.ok) {
    return error(response.status, data.message || 'Origine non autorisée');
  }

  return json(data);
};
