import { backendFetch } from "$lib/server/backend";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
  await backendFetch(event, "/api/portal/auth/logout", {
    method: "POST",
  });

  throw redirect(303, "/connexion");
};
