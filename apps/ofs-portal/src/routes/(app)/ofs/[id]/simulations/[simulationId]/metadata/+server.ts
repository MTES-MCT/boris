import { backendFetch, readJson } from '$lib/server/backend';
import { json, type RequestHandler } from '@sveltejs/kit';

type SimulationMetadata = {
  simulationId: string;
  action: string | null;
  status: string | null;
};

export const PUT: RequestHandler = async (event) => {
  const payload = await event.request.json();
  const response = await backendFetch(
    event,
    `/api/portal/ofss/${event.params.id}/eligibility-simulations/${event.params.simulationId}/metadata`,
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') || 'text/plain',
      },
    });
  }

  return json(await readJson<SimulationMetadata>(response));
};
