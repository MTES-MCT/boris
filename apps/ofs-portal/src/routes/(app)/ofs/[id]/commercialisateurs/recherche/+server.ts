import { backendFetch } from "$lib/server/backend";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
  const name = event.url.searchParams.get("name") || "";
  const response = await backendFetch(
    event,
    `/api/portal/ofss/${event.params.id}/distributors/search?name=${encodeURIComponent(name)}`,
  );
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
};
