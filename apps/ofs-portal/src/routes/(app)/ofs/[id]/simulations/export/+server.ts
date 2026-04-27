import { backendFetch } from '$lib/server/backend';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
  const response = await backendFetch(
    event,
    `/api/portal/ofss/${event.params.id}/eligibility-simulations/export?${event.url.searchParams.toString()}`,
  );

  if (response.status === 401) {
    throw redirect(
      303,
      `/connexion?returnTo=${encodeURIComponent(event.url.pathname + event.url.search)}`,
    );
  }

  if (!response.ok) {
    throw error(response.status, 'Export impossible');
  }

  const headers = new Headers();
  const contentType = response.headers.get('content-type');
  const contentDisposition = response.headers.get('content-disposition');

  if (contentType) {
    headers.set('content-type', contentType);
  }

  if (contentDisposition) {
    headers.set('content-disposition', contentDisposition);
  }

  return new Response(await response.arrayBuffer(), {
    status: response.status,
    headers,
  });
};
