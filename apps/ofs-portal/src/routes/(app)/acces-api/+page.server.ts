import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import { backendFetch, readJson } from "$lib/server/backend";
import { getPortalUser, requirePortalUser } from "$lib/server/auth";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
};

export const load: ServerLoad = async (event) => {
  requirePortalUser(await getPortalUser(event), event.url.pathname);
  event.setHeaders({ "cache-control": "no-store" });
  return {
    keys: await readJson<ApiKey[]>(
      await backendFetch(event, "/api/portal/api-keys"),
    ),
    apiUrl: `${(publicEnv.PUBLIC_API_URL || env.BACKEND_API_URL || "http://localhost:3001").replace(/\/$/, "")}/api/v1/leads`,
  };
};

export const actions: Actions = {
  create: async (event) => {
    requirePortalUser(await getPortalUser(event), event.url.pathname);
    const data = await event.request.formData();
    const response = await backendFetch(event, "/api/portal/api-keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: String(data.get("name") || "").trim() }),
    });
    if (!response.ok)
      return fail(response.status, {
        message:
          response.status === 429
            ? "Trop de créations. Réessayez dans une minute."
            : "Création impossible. Saisissez un nom de 1 à 100 caractères.",
      });
    return { created: await readJson<ApiKey & { token: string }>(response) };
  },
  remove: async (event) => {
    requirePortalUser(await getPortalUser(event), event.url.pathname);
    const data = await event.request.formData();
    const id = String(data.get("id") || "");
    if (!/^[a-f0-9-]{36}$/i.test(id))
      return fail(400, { message: "Clé invalide." });
    const response = await backendFetch(event, `/api/portal/api-keys/${id}`, {
      method: "DELETE",
    });
    if (!response.ok)
      return fail(response.status, {
        message: "La clé n’a pas pu être supprimée.",
      });
    return { removed: true };
  },
};
