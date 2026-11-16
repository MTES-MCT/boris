import { backendFetch } from "$lib/server/backend";
import { isSafePortalReturnTo } from "$lib/server/auth";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  event.setHeaders({ "cache-control": "no-store" });
  const response = await backendFetch(
    event,
    "/api/portal/auth/two-factor",
    {},
    {
      preserveSessionOnUnauthorized: true,
    },
  );
  if (!response.ok) throw redirect(303, "/connexion");
  return { returnTo: event.url.searchParams.get("returnTo") || "" };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await event.request.formData();
    const code = `${form.get("code") || ""}`;
    const returnTo = `${form.get("returnTo") || ""}`;
    const response = await backendFetch(
      event,
      "/api/portal/auth/two-factor",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      },
      { preserveSessionOnUnauthorized: true },
    );
    if (response.status === 401) throw redirect(303, "/connexion?expired=1");
    if (!response.ok) {
      return fail(400, {
        returnTo,
        message:
          response.status === 429
            ? "Trop de tentatives. Réessayez dans 15 minutes et recommencez la connexion."
            : "Code invalide ou déjà utilisé. Vérifiez votre code et réessayez.",
      });
    }
    throw redirect(303, isSafePortalReturnTo(returnTo) ? returnTo : "/");
  },
};
