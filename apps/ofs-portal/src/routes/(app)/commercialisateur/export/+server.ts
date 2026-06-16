import { backendFetch } from "$lib/server/backend";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event) => {
  const { url } = event;
  const response = await backendFetch(
    event,
    `/api/portal/ofss/commercialisateur/eligibility-simulations/export?${url.searchParams.toString()}`,
  );

  if (response.status === 401) {
    throw redirect(303, "/connexion");
  }

  if (!response.ok) {
    throw error(response.status, "Export impossible");
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      "content-type": response.headers.get("content-type") || "text/csv",
      "content-disposition":
        response.headers.get("content-disposition") ||
        'attachment; filename="transmissions-commerciales.csv"',
    },
  });
};
