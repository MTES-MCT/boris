import { backendFetch } from "$lib/server/backend";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async (event) => {
  const body = await event.request.json();
  const response = await backendFetch(
    event,
    `/api/portal/ofss/commercialisateur/eligibility-simulations/${event.params.simulationId}/metadata`,
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (response.status === 401) {
    throw redirect(303, "/connexion");
  }

  return new Response(await response.text(), {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
};
